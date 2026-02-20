import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // bij jou heet die zo, dus NIET aanpassen
);

async function getSpotifyAccessToken() {
  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!res.ok) throw new Error(`Spotify token refresh failed: ${res.status}`);
  const json = await res.json();
  return json.access_token;
}

async function fetchPlaylistFollowers(accessToken, playlistId) {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error(`Playlist fetch failed ${playlistId}: ${res.status}`);
  const data = await res.json();
  return data?.followers?.total ?? 0;
}

export default async function handler(req, res) {
  try {
    // simpele beveiliging (secret in query)
    if (req.query.secret !== process.env.CRON_SECRET) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    // Lees config uit app_config
    const { data: row, error: readErr } = await supabase
      .from("app_config")
      .select("config")
      .eq("id", 1)
      .single();
    if (readErr) throw readErr;

    const config = row?.config || {};

    // Support: config.playlists OR config.playlist_groups
    let playlistList = [];
    if (Array.isArray(config.playlists)) {
      playlistList = config.playlists;
    } else if (Array.isArray(config.playlist_groups)) {
      playlistList = config.playlist_groups.flatMap(g => g.playlists || []);
    } else {
      throw new Error("No playlists found in app_config.config");
    }

    const ids = [...new Set(playlistList.map(p => p.id).filter(Boolean))];
    if (!ids.length) throw new Error("Playlist list is empty");

    const token = await getSpotifyAccessToken();

    // Haal followers op
    const results = [];
    for (const id of ids) {
      const followers = await fetchPlaylistFollowers(token, id);
      results.push({ id, followers });
    }

    const total_followers = results.reduce((s, r) => s + (r.followers || 0), 0);
    const updated_at = new Date().toISOString();
    const byId = Object.fromEntries(results.map(r => [r.id, r.followers]));

    // Schrijf terug naar config (totaal + per playlist)
    const newConfig = { ...config, total_followers, updated_at };

    if (Array.isArray(config.playlists)) {
      newConfig.playlists = config.playlists.map(p => ({
        ...p,
        followers: byId[p.id] ?? p.followers ?? null,
      }));
    } else {
      newConfig.playlist_groups = config.playlist_groups.map(g => ({
        ...g,
        playlists: (g.playlists || []).map(p => ({
          ...p,
          followers: byId[p.id] ?? p.followers ?? null,
        })),
      }));
    }

    const { error: upErr } = await supabase
      .from("app_config")
      .update({ config: newConfig })
      .eq("id", 1);
    if (upErr) throw upErr;

    return res.status(200).json({ ok: true, playlists: results.length, total_followers, updated_at });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e.message || e) });
  }
}

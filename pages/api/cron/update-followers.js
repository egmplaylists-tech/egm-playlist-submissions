import { createClient } from "@supabase/supabase-js";

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

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Spotify token refresh failed: ${res.status} ${txt}`);
  }

  const json = await res.json();
  if (!json?.access_token) throw new Error("Spotify token refresh returned no access_token");
  return json.access_token;
}

async function fetchPlaylistFollowers(accessToken, playlistId) {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Playlist fetch failed (${playlistId}): ${res.status} ${txt}`);
  }

  const data = await res.json();
  return data?.followers?.total ?? 0;
}

export default async function handler(req, res) {
  try {
    // 0) Security: simple secret check (query param)
    if (req.query.secret !== process.env.CRON_SECRET) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    // 1) env + url checks (same style as app-config.js)
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE;

    if (!rawUrl) {
      return res.status(500).json({ ok: false, where: "env", error: "Missing SUPABASE URL" });
    }
    if (!serviceKey) {
      return res.status(500).json({ ok: false, where: "env", error: "Missing SERVICE ROLE KEY" });
    }

    const trimmed = String(rawUrl).trim();
    let origin;
    try {
      origin = new URL(trimmed).origin;
    } catch (e) {
      return res.status(500).json({
        ok: false,
        where: "url-parse",
        error: "Invalid SUPABASE URL (has typo/space/newline)",
        rawUrlPreview: String(rawUrl).slice(0, 80),
        trimmedPreview: trimmed.slice(0, 80),
      });
    }

    // 2) Supabase client
    const supabase = createClient(origin, serviceKey, {
      auth: { persistSession: false },
    });

    // 3) Load config row: IMPORTANT = id "main" (as in app-config.js)
    const { data, error: readErr } = await supabase
      .from("app_config")
      .select("config")
      .eq("id", "main")
      .maybeSingle();

    if (readErr) {
      return res.status(500).json({ ok: false, where: "supabase-query", error: readErr.message, origin });
    }
    if (!data?.config) {
      return res.status(500).json({ ok: false, where: "supabase-query", error: 'No app_config row found for id="main"', origin });
    }

    const config = data.config || {};

    // 4) Determine playlists list (supports playlist_groups or playlists)
    let playlistList = [];
    if (Array.isArray(config.playlists)) {
      playlistList = config.playlists;
    } else if (Array.isArray(config.playlist_groups)) {
      playlistList = config.playlist_groups.flatMap((g) =>
        Array.isArray(g?.playlists) ? g.playlists : []
      );
    } else {
      return res.status(500).json({ ok: false, where: "config", error: "No playlists found in config (missing playlists or playlist_groups)" });
    }

    const ids = [...new Set(playlistList.map((p) => p?.id).filter(Boolean))];
    if (!ids.length) {
      return res.status(500).json({ ok: false, where: "config", error: "Playlist ID list is empty" });
    }

    // 5) Spotify token + fetch followers
    const token = await getSpotifyAccessToken();

    const results = [];
    for (const id of ids) {
      const followers = await fetchPlaylistFollowers(token, id);
      results.push({ id, followers });
    }

    const total_followers = results.reduce((sum, r) => sum + (r.followers || 0), 0);
    const updated_at_marker = new Date().toISOString();
    const byId = Object.fromEntries(results.map((r) => [r.id, r.followers]));

    // 6) Write back into config (totaal + per playlist followers)
    const newConfig = {
      ...config,
      total_followers,
      updated_at_marker, // jouw app-config endpoint toont deze marker ook
    };

    if (Array.isArray(config.playlists)) {
      newConfig.playlists = config.playlists.map((p) => ({
        ...p,
        followers: byId[p.id] ?? p.followers ?? null,
      }));
    } else if (Array.isArray(config.playlist_groups)) {
      newConfig.playlist_groups = config.playlist_groups.map((g) => ({
        ...g,
        playlists: (g.playlists || []).map((p) => ({
          ...p,
          followers: byId[p.id] ?? p.followers ?? null,
        })),
      }));
    }

    // 7) Update row id="main"
    const { error: upErr } = await supabase
      .from("app_config")
      .update({ config: newConfig })
      .eq("id", "main");

    if (upErr) {
      return res.status(500).json({ ok: false, where: "supabase-update", error: upErr.message, origin });
    }

    return res.status(200).json({
      ok: true,
      origin,
      playlists: results.length,
      total_followers,
      updated_at_marker,
    });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      where: "catch-all",
      error: String(e?.message || e),
    });
  }
}

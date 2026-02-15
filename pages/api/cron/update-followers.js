// pages/api/cron/update-followers.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    // 1) Beveiliging (zodat niemand jouw cron endpoint kan misbruiken)
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      SPOTIFY_CLIENT_ID,
      SPOTIFY_CLIENT_SECRET,
    } = process.env;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: "Missing Supabase env vars" });
    }
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      return res.status(500).json({ error: "Missing Spotify env vars" });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Spotify token
    const basic = Buffer.from(
      `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    });

    if (!tokenRes.ok) {
      const t = await tokenRes.text();
      return res.status(500).json({ error: "Spotify token failed", detail: t });
    }

    const spotifyToken = (await tokenRes.json()).access_token;

    // 2) Haal tracked playlists op uit Supabase
    const { data: playlists, error } = await supabase
      .from("playlists_tracked")
      .select("playlist_id, name")
      .eq("active", true);

    if (error) return res.status(500).json({ error: error.message });
    if (!playlists?.length) return res.status(200).json({ total: 0, playlists: 0 });

    // 3) Tel followers op
    let total = 0;
    const details = [];

    for (const p of playlists) {
      const r = await fetch(`https://api.spotify.com/v1/playlists/${p.playlist_id}`, {
        headers: { Authorization: `Bearer ${spotifyToken}` },
      });

      if (!r.ok) {
        // Niet hard failen: loggen en doorgaan
        details.push({ name: p.name, id: p.playlist_id, followers: null, error: r.status });
        continue;
      }

      const data = await r.json();
      const followers = data?.followers?.total ?? 0;

      total += followers;
      details.push({ name: data?.name ?? p.name, id: p.playlist_id, followers });
    }

    const now = new Date().toISOString();

    // 4) Bewaar in playlist_stats
    // We proberen eerst UPDATE op id=1 (jij hebt al id=1 in de tabel)
    const { data: updated, error: upErr } = await supabase
      .from("playlist_stats")
      .update({ total_followers: total, updated_at: now })
      .eq("id", 1)
      .select();

    if (upErr) return res.status(500).json({ error: upErr.message });

    // Als er om een of andere reden nog geen rij is: dan INSERT (zonder id)
    if (!updated || updated.length === 0) {
      const { error: insErr } = await supabase
        .from("playlist_stats")
        .insert({ total_followers: total, updated_at: now });

      if (insErr) return res.status(500).json({ error: insErr.message });
    }

    return res.status(200).json({
      ok: true,
      total,
      playlists: playlists.length,
      updated_at: now,
      details,
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message || String(e) });
  }
}

// pages/api/app-config.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    const rawUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE;

    // 1) env checks
    if (!rawUrl) {
      return res
        .status(500)
        .json({ ok: false, where: "env", error: "Missing SUPABASE URL" });
    }
    if (!serviceKey) {
      return res
        .status(500)
        .json({ ok: false, where: "env", error: "Missing SERVICE ROLE KEY" });
    }

    // 2) URL sanitizing check (catches newline/space)
    const trimmed = String(rawUrl).trim();
    let origin;
    try {
      origin = new URL(trimmed).origin;
    } catch (e) {
      return res.status(500).json({
        ok: false,
        where: "url-parse",
        error: "Invalid NEXT_PUBLIC_SUPABASE_URL (has typo/space/newline)",
        rawUrlPreview: String(rawUrl).slice(0, 80),
        trimmedPreview: trimmed.slice(0, 80),
      });
    }

    // 3) quick reachability test
    try {
      const health = await fetch(origin, { method: "GET" });
      // not all origins return 200, but fetch should not fail
      res.setHeader("x-health-status", String(health.status));
    } catch (e) {
      return res.status(500).json({
        ok: false,
        where: "fetch-origin",
        error: "Fetch to Supabase origin failed (network/DNS/invalid host)",
        origin,
      });
    }

    // 4) Supabase query
    const supabase = createClient(origin, serviceKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from("app_config")
      .select("config")
      .eq("id", "main")
      .maybeSingle();

    if (error) {
      return res
        .status(500)
        .json({ ok: false, where: "supabase-query", error: error.message, origin });
    }

return res.status(200).json({
  ok: true,
  origin,

  // 👉 dit is de enige nieuwe regel die ontbrak
  total_followers: cfg.total_followers ?? null,

  playlistsCount: flat.length,
  hasPlaylistGroups: Array.isArray(cfg.playlist_groups),
  debug_marker_submit: cfg.debug_marker_submit || null,
  updated_at_marker: cfg.updated_at_marker || null,
  playlists: flat,
});

      // ✅ NEW: expose followers + marker from config
      total_followers: cfg.total_followers ?? null,
      updated_at_marker: cfg.updated_at_marker ?? null,

      playlistsCount: flat.length,
      hasPlaylistGroups: Array.isArray(cfg.playlist_groups),
      debug_marker_submit: cfg.debug_marker_submit || null,
      playlists: flat,
    });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      where: "catch-all",
      error: String(e?.message || e),
    });
  }
}

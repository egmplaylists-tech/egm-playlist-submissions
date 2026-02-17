// pages/api/app-config.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({
        ok: false,
        error: "Missing SUPABASE URL or SERVICE ROLE KEY in Vercel env vars",
      });
    }

    // ✅ duidelijke check (vangt line breaks/spaties/foute URL)
    let parsed;
    try {
      parsed = new URL(String(supabaseUrl).trim());
    } catch {
      return res.status(500).json({
        ok: false,
        error:
          "Invalid NEXT_PUBLIC_SUPABASE_URL. It contains a typo/space/newline.",
      });
    }

    const cleanUrl = parsed.origin; // bv. https://xxxx.supabase.co

    const supabase = createClient(cleanUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from("app_config")
      .select("config")
      .eq("id", "main")
      .maybeSingle();

    if (error) return res.status(500).json({ ok: false, error: error.message });

    const cfg = data?.config || {};
    const groups = Array.isArray(cfg.playlist_groups) ? cfg.playlist_groups : [];
    const flat = groups.flatMap((g) =>
      Array.isArray(g?.playlists) ? g.playlists : []
    );

    return res.status(200).json({
      ok: true,
      playlist_groups: groups,
      playlists: flat,
      debug_marker_submit: cfg.debug_marker_submit || null,
      updated_at_marker: cfg.updated_at_marker || null,
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}


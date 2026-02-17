// pages/api/app-config.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

    // ✅ Gebruik NOOIT service role in de browser. Hier mag het wél (server-side).
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({
        error: "Missing SUPABASE URL or SERVICE ROLE KEY on server",
      });
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from("app_config")
      .select("config")
      .eq("id", "main")
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const cfg = data?.config || {};

    // ✅ A: single source of truth
    const groups = Array.isArray(cfg.playlist_groups) ? cfg.playlist_groups : [];
    const list = groups.flatMap((g) => (Array.isArray(g?.playlists) ? g.playlists : []));

    return res.status(200).json({
      ok: true,
      playlist_groups: groups,
      playlists: list,
      debug_marker_submit: cfg.debug_marker_submit || null,
      updated_at_marker: cfg.updated_at_marker || null,
    });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}

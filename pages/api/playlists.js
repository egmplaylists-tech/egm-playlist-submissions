export default async function handler(req, res) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";

    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({ ok: false, error: "Missing Supabase server env vars" });
    }

    const cfgUrl =
      supabaseUrl.replace(/\/$/, "") +
      "/rest/v1/app_config?id=eq.main&select=config";

    const r = await fetch(cfgUrl, {
      headers: { apikey: serviceKey, authorization: `Bearer ${serviceKey}` },
    });

    const j = await r.json().catch(() => null);
    if (!r.ok || !Array.isArray(j) || !j[0]?.config) {
      return res.status(500).json({ ok: false, where: "load-app_config", status: r.status, body: j });
    }

    const cfg = j[0].config;

    let list = [];
    if (Array.isArray(cfg?.playlist_groups)) {
      list = cfg.playlist_groups.flatMap(g => g?.playlists || []);
    } else if (Array.isArray(cfg?.playlists)) {
      list = cfg.playlists;
    }

    // no-cache zodat je nooit “oude” data ziet
    res.setHeader("Cache-Control", "no-store");

    return res.status(200).json({ ok: true, playlists: list });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}

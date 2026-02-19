// pages/api/playlists.js

function normalizePlaylists(list) {
  if (!Array.isArray(list)) return [];

  const cleaned = list
    .map((p) => ({
      id: String(p?.id || "").trim(),
      name: String(p?.name || "").trim(),
    }))
    .filter((p) => p.id && p.name);

  // de-dupe by id
  const seen = new Set();
  const deduped = [];
  for (const p of cleaned) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    deduped.push(p);
  }

  // stable sort by name
  deduped.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));

  return deduped;
}

export default async function handler(req, res) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      "";

    if (!supabaseUrl || !serviceKey) {
      res.setHeader("Cache-Control", "no-store");
      return res.status(500).json({ ok: false, error: "Missing Supabase server env vars" });
    }

    const cfgUrl =
      supabaseUrl.replace(/\/$/, "") +
      "/rest/v1/app_config?id=eq.main&select=config";

    const r = await fetch(cfgUrl, {
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
      },
      // extra: avoid edge caching surprises
      cache: "no-store",
    });

    const j = await r.json().catch(() => null);
    if (!r.ok || !Array.isArray(j) || !j[0]?.config) {
      res.setHeader("Cache-Control", "no-store");
      return res.status(500).json({
        ok: false,
        where: "load-app_config",
        status: r.status,
        body: j,
      });
    }

    const cfg = j[0].config;

    // Accept both formats
    let raw = [];
    if (Array.isArray(cfg?.playlist_groups)) {
      raw = cfg.playlist_groups.flatMap((g) => g?.playlists || []);
    } else if (Array.isArray(cfg?.playlists)) {
      raw = cfg.playlists;
    }

    const playlists = normalizePlaylists(raw);

    // Hard no-cache (browser + Vercel)
    res.setHeader("Cache-Control", "no-store, max-age=0");
    // optional debug markers if you ever need to verify freshness
    // res.setHeader("x-egm-source", "app_config");

    return res.status(200).json({
      ok: true,
      playlistsCount: playlists.length,
      playlists,
      // helpful if you keep markers in config:
      debug_marker_submit: cfg?.debug_marker_submit || null,
      updated_at_marker: cfg?.updated_at_marker || null,
    });
  } catch (e) {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}


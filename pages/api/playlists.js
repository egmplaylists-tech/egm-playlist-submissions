// pages/api/playlists.js

function normalizePlaylists(list) {
  if (!Array.isArray(list)) return [];

  const cleaned = list
    .map((p) => ({
      id: String(p?.id ?? p?.spotifyId ?? p?.playlist_id ?? "").trim(),
      name: String(p?.name ?? p?.title ?? p?.label ?? "").trim(),
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
  // Allow only GET
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.setHeader("Cache-Control", "no-store, max-age=0, s-maxage=0, must-revalidate");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // Hard no-cache (browser + Vercel/CDN)
  res.setHeader("Cache-Control", "no-store, max-age=0, s-maxage=0, must-revalidate");

  try {
    // Prefer server-only env vars
    const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
    const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "").trim();

    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({
        ok: false,
        error: "Missing Supabase server env vars (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)",
      });
    }

    const cfgUrl =
      supabaseUrl.replace(/\/$/, "") + "/rest/v1/app_config?id=eq.main&select=config";

    const r = await fetch(cfgUrl, {
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
        accept: "application/json",
      },
      cache: "no-store",
    });

    if (!r.ok) {
      const text = await r.text().catch(() => "");
      return res.status(500).json({
        ok: false,
        where: "load-app_config",
        status: r.status,
        statusText: r.statusText,
        bodyText: text.slice(0, 800),
      });
    }

    const j = await r.json();

    if (!Array.isArray(j) || !j[0]?.config) {
      return res.status(500).json({
        ok: false,
        where: "parse-app_config",
        error: "Unexpected payload shape (expected array with [0].config)",
        body: j,
      });
    }

    const cfg = j[0].config;

    // Accept both formats:
    // - cfg.playlist_groups: [{ group, playlists: [{id,name}, ...] }, ...]
    // - cfg.playlists: [{id,name}, ...]
    let raw = [];

    if (Array.isArray(cfg?.playlist_groups)) {
      raw = cfg.playlist_groups.flatMap((g) => (Array.isArray(g?.playlists) ? g.playlists : []));
    } else if (Array.isArray(cfg?.playlists)) {
      raw = cfg.playlists;
    } else {
      raw = [];
    }

    const playlists = normalizePlaylists(raw);

    // Debug counts (safe to keep; helps when things ever “jump” again)
    const playlistsRawCount = Array.isArray(raw) ? raw.length : 0;
    const playlistsDroppedByNormalize = Math.max(0, playlistsRawCount - playlists.length);

    return res.status(200).json({
      ok: true,
      playlistsCount: playlists.length,
      playlistsRawCount,
      playlistsDroppedByNormalize,
      playlists,
      // optional markers if you store them in config
      debug_marker_submit: cfg?.debug_marker_submit ?? null,
      updated_at_marker: cfg?.updated_at_marker ?? null,
    });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: String(e?.message || e),
    });
  }
}

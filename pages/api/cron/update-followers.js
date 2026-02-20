// pages/api/cron/update-followers.js

function extractPlaylistId(input) {
  if (!input) return null;
  const s = String(input).trim();

  // full spotify URL
  const m = s.match(/open\.spotify\.com\/playlist\/([A-Za-z0-9]+)/i);
  if (m) return m[1];

  // already looks like an id
  if (/^[A-Za-z0-9]{10,}$/.test(s)) return s;

  return null;
}

function getProvidedKey(req) {
  // Accept either query key or header key
  const raw =
    (req.query && req.query.key) ||
    req.headers["x-admin-key"] ||
    "";

  // Important: decode URL encoding safely.
  // If someone uses + in URL, it may arrive as space; try to recover.
  let s = String(raw).trim();

  // recover common case where '+' became ' '
  if (s.includes(" ")) s = s.replace(/ /g, "+");

  try {
    // decode only if it looks encoded (contains %)
    if (s.includes("%")) s = decodeURIComponent(s);
  } catch (_) {
    // ignore decode errors
  }

  return s.trim();
}

async function getSpotifyAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in Vercel env");
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }).toString(),
  });

  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) {
    throw new Error(`Spotify token failed: ${r.status} ${JSON.stringify(j)}`);
  }
  return j.access_token;
}

export default async function handler(req, res) {
  try {
    // Allow GET (manual test) and allow cron calls
    if (req.method !== "GET") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    // 1) Security check
    const expected = String(process.env.ADMIN_KEY || "").trim();
    if (!expected) {
      return res.status(500).json({ ok: false, error: "Missing ADMIN_KEY in env" });
    }

    const provided = getProvidedKey(req);
    if (provided !== expected) {
      return res.status(401).json({ ok: false, error: "Unauthorized (bad key)" });
    }

    // 2) Supabase server-side credentials
    const supabaseUrl =
      (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").trim();

    const serviceKey =
      (process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_SERVICE_KEY ||
        "").trim();

    if (!supabaseUrl) {
      return res.status(500).json({ ok: false, error: "Missing SUPABASE URL env" });
    }
    if (!serviceKey) {
      return res.status(500).json({
        ok: false,
        error:
          "Missing service key env. Set SUPABASE_SERVICE_ROLE_KEY (preferred) or SUPABASE_SERVICE_KEY in Vercel.",
      });
    }

    // 3) Load app_config (id=main) via Supabase REST (service role)
    const cfgUrl =
      supabaseUrl.replace(/\/$/, "") +
      "/rest/v1/app_config?id=eq.main&select=config";

    const cfgRes = await fetch(cfgUrl, {
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
      },
    });

    const cfgJson = await cfgRes.json().catch(() => null);
    if (!cfgRes.ok || !Array.isArray(cfgJson) || !cfgJson[0]?.config) {
      return res.status(500).json({
        ok: false,
        where: "load-app_config",
        status: cfgRes.status,
        body: cfgJson,
      });
    }

    const cfg = cfgJson[0].config;

    // 4) Get playlists list from playlist_groups (fallback to playlists)
    let list = [];
    if (Array.isArray(cfg?.playlist_groups)) {
      list = cfg.playlist_groups.flatMap((g) => g?.playlists || []);
    } else if (Array.isArray(cfg?.playlists)) {
      list = cfg.playlists;
    }

    const ids = list
      .map((p) => extractPlaylistId(p?.id))
      .filter(Boolean);

    const uniqueIds = Array.from(new Set(ids));

    if (!uniqueIds.length) {
      // Still update stats to 0 to show it ran
      const payload0 = { total_followers: 0, updated_at: new Date().toISOString() };
      await fetch(
        supabaseUrl.replace(/\/$/, "") + "/rest/v1/playlist_stats?id=eq.1",
        {
          method: "PATCH",
          headers: {
            apikey: serviceKey,
            authorization: `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify(payload0),
        }
      );

      return res.status(200).json({
        ok: true,
        note: "No playlists found in config",
        total_followers: 0,
        playlists_count: 0,
      });
    }

    // 5) Spotify fetch followers.total per playlist
    const token = await getSpotifyAccessToken();

    let total = 0;
    let okCount = 0;
    let failCount = 0;

    const concurrency = 6;

    for (let i = 0; i < uniqueIds.length; i += concurrency) {
      const chunk = uniqueIds.slice(i, i + concurrency);

      const results = await Promise.allSettled(
        chunk.map(async (id) => {
          const r = await fetch(
            `https://api.spotify.com/v1/playlists/${id}?fields=followers.total`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const j = await r.json().catch(() => ({}));
          if (!r.ok) {
            throw new Error(
              `Spotify playlist ${id} failed: ${r.status} ${JSON.stringify(j)}`
            );
          }
          return Number(j?.followers?.total || 0);
        })
      );

      for (const rr of results) {
        if (rr.status === "fulfilled") {
          total += rr.value;
          okCount += 1;
        } else {
          failCount += 1;
        }
      }
    }

    // 6) PATCH playlist_stats row id=1
    const patchUrl =
      supabaseUrl.replace(/\/$/, "") + "/rest/v1/playlist_stats?id=eq.1";

    const payload = {
      total_followers: total,
      updated_at: new Date().toISOString(),
    };

    const patchRes = await fetch(patchUrl, {
      method: "PATCH",
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });

    const patchText = await patchRes.text();
    if (!patchRes.ok) {
      return res.status(500).json({
        ok: false,
        where: "supabase-patch",
        status: patchRes.status,
        body: patchText || "(empty)",
      });
    }

    return res.status(200).json({
      ok: true,
      playlists_count: uniqueIds.length,
      fetched_ok: okCount,
      fetched_failed: failCount,
      total_followers: total,
      wrote: payload,
    });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      where: "handler",
      error: String(e?.message || e),
    });
  }
}

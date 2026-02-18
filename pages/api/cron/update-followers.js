export default async function handler(req, res) {
  try {
    // 1) Security check (zelfde key als jij nu gebruikt)
    const provided = String(req.query.key || "");
    const expected = String(process.env.ADMIN_KEY || "");
    if (!expected) {
      return res.status(500).json({ ok: false, error: "Missing ADMIN_KEY in env" });
    }
    if (provided !== expected) {
      return res.status(401).json({ ok: false, error: "Unauthorized (bad key)" });
    }

    // 2) Supabase server-side credentials
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      "";

    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      "";

    if (!supabaseUrl) {
      return res.status(500).json({ ok: false, error: "Missing SUPABASE URL env" });
    }
    if (!serviceKey) {
      return res.status(500).json({
        ok: false,
        error:
          "Missing service key env. Set SUPABASE_SERVICE_ROLE_KEY (preferred) or SUPABASE_SERVICE_KEY in Vercel (Production).",
      });
    }

    // 3) TODO: hier hoort jouw echte berekening te staan.
    // Voor nu: als je al 14346 hebt, zet dit tijdelijk hard om te bewijzen dat schrijven werkt.
    // Daarna zetten we de Spotify fetch terug goed.
    const total_followers = 14346;

    // 4) Upsert naar playlist_stats (id=1)
    const upsertUrl =
      supabaseUrl.replace(/\/$/, "") +
      "/rest/v1/playlist_stats?on_conflict=id";

    const payload = {
      id: 1,
      total_followers,
      updated_at: new Date().toISOString(),
    };

    const r = await fetch(upsertUrl, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(payload),
    });

    const text = await r.text(); // Supabase geeft soms lege body terug
    if (!r.ok) {
      return res.status(500).json({
        ok: false,
        where: "supabase-upsert",
        status: r.status,
        body: text || "(empty)",
      });
    }

    return res.status(200).json({
      ok: true,
      wrote: payload,
      supabaseStatus: r.status,
      supabaseBody: text || "(empty)",
    });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      where: "handler",
      error: String(e?.message || e),
    });
  }
}

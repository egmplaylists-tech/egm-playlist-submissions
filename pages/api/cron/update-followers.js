export default async function handler(req, res) {
  try {
    // 1) Security check
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
          "Missing service key env. Set SUPABASE_SERVICE_ROLE_KEY (preferred) or SUPABASE_SERVICE_KEY in Vercel.",
      });
    }

    // 3) Zet je gewenste waarde (tijdelijk hard-coded om te bewijzen dat schrijven werkt)
    const total_followers = 14346;

    // 4) ✅ UPDATE/PATCH de bestaande rij (id=1)
    // GEEN id in payload! (want id is GENERATED ALWAYS)
    const patchUrl =
      supabaseUrl.replace(/\/$/, "") +
      "/rest/v1/playlist_stats?id=eq.1";

    const payload = {
      total_followers,
      updated_at: new Date().toISOString(),
    };

    const r = await fetch(patchUrl, {
      method: "PATCH",
      headers: {
        apikey: serviceKey,
        authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });

    const text = await r.text();

    if (!r.ok) {
      return res.status(500).json({
        ok: false,
        where: "supabase-patch",
        status: r.status,
        body: text || "(empty)",
      });
    }

    return res.status(200).json({
      ok: true,
      updatedRow: "id=1",
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

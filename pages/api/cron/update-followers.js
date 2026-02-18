export default async function handler(req, res) {
  return res.status(200).json({
    ok: true,
    marker: "NEW_CODE_RUNNING"
  });
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

// 4) Update playlist_stats (id=1)  — geen insert/upsert, want id is GENERATED ALWAYS
const updateUrl =
  supabaseUrl.replace(/\/$/, "") +
  "/rest/v1/playlist_stats?id=eq.1";

const payload = {
  total_followers,
  updated_at: new Date().toISOString(),
};

const r = await fetch(updateUrl, {
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
    where: "supabase-update",
    status: r.status,
    body: text || "(empty)",
  });
}

return res.status(200).json({
  ok: true,
  updated_row: JSON.parse(text || "[]"),
});


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

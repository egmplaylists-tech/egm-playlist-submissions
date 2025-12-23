import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  // ✅ this must be your service role key (server-only)
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

function bad(res, msg, status = 400) {
  return res.status(status).json({ ok: false, error: msg });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return bad(res, "Method not allowed", 405);

  if (!process.env.SUPABASE_URL) return bad(res, "Missing SUPABASE_URL env var", 500);
  if (!process.env.SUPABASE_SERVICE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return bad(res, "Missing SUPABASE_SERVICE_KEY (or SUPABASE_SERVICE_ROLE_KEY) env var", 500);
  }

  try {
    const {
      playlistId,
      playlistName,
      trackUrl,
      artistName,
      email,
      instagram,
      pitch,
      gates,
    } = req.body || {};

    if (!playlistId) return bad(res, "playlistId is required");
    if (!trackUrl) return bad(res, "trackUrl is required");
    if (!artistName) return bad(res, "artistName is required");
    if (!email) return bad(res, "email is required");

    // store submission
    const { data, error } = await supabase
      .from("submissions")
      .insert([
        {
          playlist_id: String(playlistId),
          playlist_name: playlistName ? String(playlistName) : null,
          submitted_track_url: String(trackUrl),
          artist_name: String(artistName),
          email: String(email),
          instagram: instagram ? String(instagram) : null,
          pitch: pitch ? String(pitch) : null,
          status: "pending",
          gates: gates || null,
        },
      ])
      .select("id")
      .single();

    if (error) return bad(res, error.message, 500);

    return res.status(200).json({ ok: true, id: data?.id });
  } catch (e) {
    return bad(res, String(e?.message || e), 500);
  }
}


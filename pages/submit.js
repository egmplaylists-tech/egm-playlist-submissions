import { createClient } from "@supabase/supabase-js";

function extractPlaylistId(input) {
  if (!input) return "";
  const s = String(input).trim();

  // spotify:playlist:<id>
  if (s.startsWith("spotify:playlist:")) {
    return s.split("spotify:playlist:")[1].split("?")[0].trim();
  }

  // https://open.spotify.com/playlist/<id>
  const m = s.match(/open\.spotify\.com\/playlist\/([A-Za-z0-9]+)/);
  if (m && m[1]) return m[1];

  // already looks like an id
  if (/^[A-Za-z0-9]{10,40}$/.test(s) && !s.includes("http")) return s;

  return "";
}

function extractTrackId(input) {
  if (!input) return "";
  const s = String(input).trim();

  // spotify:track:<id>
  if (s.startsWith("spotify:track:")) {
    return s.split("spotify:track:")[1].split("?")[0].trim();
  }

  // https://open.spotify.com/track/<id>
  const m = s.match(/open\.spotify\.com\/track\/([A-Za-z0-9]+)/);
  if (m && m[1]) return m[1];

  return "";
}

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  try {
    const b = req.body || {};

    const playlistId = extractPlaylistId(b.playlistId || b.playlist_id || "");
    const playlistName = b.playlistName || b.playlist_name || null;

    const trackUrl = b.trackUrl || b.submitted_track_url || "";
    const trackId = extractTrackId(trackUrl);

    const artistName = (b.artistName || b.artist_name || "").trim();
    const email = (b.email || "").trim();

    const instagram = (b.instagram || "").trim() || null;
    const pitch = (b.pitch || "").trim() || null;

    if (!playlistId) return res.status(400).json({ ok: false, error: "Invalid playlist" });
    if (!trackId) return res.status(400).json({ ok: false, error: "Invalid Spotify track link" });
    if (!artistName) return res.status(400).json({ ok: false, error: "Artist name is required" });
    if (!email || !email.includes("@")) return res.status(400).json({ ok: false, error: "Email is required" });

    const { data, error } = await supabase
      .from("submissions")
      .insert([{
        playlist_id: playlistId,
        playlist_name: playlistName,
        submitted_track_url: trackUrl,
        artist_name: artistName,
        email,
        instagram,
        pitch,
        status: "new",
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ ok: false, error: error.message });

    return res.status(200).json({ ok: true, submission: data });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}

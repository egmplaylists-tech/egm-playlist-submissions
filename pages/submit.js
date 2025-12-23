import { createClient } from "@supabase/supabase-js";

/**
 * Extract Spotify ID from:
 * - https://open.spotify.com/playlist/<ID>?...
 * - https://open.spotify.com/track/<ID>?...
 * - spotify:playlist:<ID>
 * - spotify:track:<ID>
 */
function extractSpotifyId(input, type) {
  if (!input) return "";
  const s = String(input).trim();

  // spotify:playlist:<id> or spotify:track:<id>
  const colonPrefix = `spotify:${type}:`;
  if (s.startsWith(colonPrefix)) {
    return s.slice(colonPrefix.length).split("?")[0].trim();
  }

  // open.spotify.com/<type>/<id>
  const m = s.match(new RegExp(`open\\.spotify\\.com\\/${type}\\/([A-Za-z0-9]+)`));
  if (m && m[1]) return m[1];

  // if it's already an ID (spotify IDs are alnum, usually 22 chars)
  if (/^[A-Za-z0-9]{10,40}$/.test(s) && !s.includes("http")) return s;

  return "";
}

function bad(res, msg, code = 400) {
  return res.status(code).json({ ok: false, error: msg });
}

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  // your env var is named SUPABASE_SERVICE_KEY in Vercel screenshot
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export default async function handler(req, res) {
  if (req.method !== "POST") return bad(res, "Method not allowed", 405);

  try {
    const body = req.body || {};

    // Accept both naming styles (to be safe)
    const playlistIdRaw = body.playlistId || body.playlist_id || "";
    const playlistName = body.playlistName || body.playlist_name || null;
    const trackUrl = body.trackUrl || body.submitted_track_url || "";
    const artistName = body.artistName || body.artist_name || "";
    const email = body.email || "";
    const instagram = body.instagram || null;
    const pitch = body.pitch || null;

    // Gates/options (kept for later use)
    const opts = body.opts || {};
    const followPlaylist = !!opts.followPlaylist;
    const followCurator = !!opts.followCurator;
    const saveTrack = !!opts.saveTrack;
    const presave = !!opts.presave;

    // Validate required fields
    const playlistId = extractSpotifyId(playlistIdRaw, "playlist");
    if (!playlistId) return bad(res, "Missing/invalid playlistId");
    const trackId = extractSpotifyId(trackUrl, "track");
    if (!trackId) return bad(res, "Missing/invalid Spotify track link");
    if (!artistName || String(artistName).trim().length < 2)
      return bad(res, "Artist name is required");
    if (!email || !String(email).includes("@"))
      return bad(res, "Email is required");

    // Insert submission
    const insertRow = {
      playlist_id: String(playlistId),
      playlist_name: playlistName ? String(playlistName) : null,
      submitted_track_url: String(trackUrl),
      artist_name: String(artistName),
      email: String(email),
      instagram: instagram ? String(instagram) : null,
      pitch: pitch ? String(pitch) : null,
      status: "new",
      // store opts (optional columns — if they don't exist, Supabase will error)
      // If your table doesn't have these columns, remove them.
      follow_playlist: followPlaylist,
      follow_curator: followCurator,
      save_track: saveTrack,
      presave: presave,
    };

    const { data, error } = await supabase
      .from("submissions")
      .insert([insertRow])
      .select()
      .single();

    if (error) {
      // If error is about unknown columns, retry without the gate columns
      const msg = String(error.message || "");
      if (msg.toLowerCase().includes("column") && msg.toLowerCase().includes("does not exist")) {
        const fallbackRow = {
          playlist_id: String(playlistId),
          playlist_name: playlistName ? String(playlistName) : null,
          submitted_track_url: String(trackUrl),
          artist_name: String(artistName),
          email: String(email),
          instagram: instagram ? String(instagram) : null,
          pitch: pitch ? String(pitch) : null,
          status: "new",
        };
        const retry = await supabase
          .from("submissions")
          .insert([fallbackRow])
          .select()
          .single();

        if (retry.error) return bad(res, retry.error.message || "DB insert failed", 500);
        return res.status(200).json({ ok: true, submission: retry.data });
      }

      return bad(res, error.message || "DB insert failed", 500);
    }

    return res.status(200).json({ ok: true, submission: data });
  } catch (err) {
    return bad(res, "Server error", 500);
  }
}

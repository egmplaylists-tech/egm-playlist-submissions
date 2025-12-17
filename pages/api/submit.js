import { getSupabaseAdmin } from "../../lib/supabaseAdmin";
import { extractSpotifyId } from "../../lib/spotify";

function parseCookies(cookieHeader = "") {
  const out = {};
  cookieHeader.split(";").forEach((part) => {
    const [k, ...v] = part.trim().split("=");
    if (!k) return;
    out[k] = decodeURIComponent(v.join("="));
  });
  return out;
}

async function getLatestTokenForUser(supabase, userId) {
  const { data, error } = await supabase
    .from("spotify_tokens")
    .select("*")
    .eq("spotify_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw error;
  return data?.[0] || null;
}

async function runGates(accessToken, opts) {
  const headers = { Authorization: `Bearer ${accessToken}` };

  if (opts.followCurator && process.env.CURATOR_ARTIST_ID) {
    await fetch(`https://api.spotify.com/v1/me/following?type=artist&ids=${encodeURIComponent(process.env.CURATOR_ARTIST_ID)}`, {
      method: "PUT", headers
    });
  }

  if (opts.followPlaylist && opts.playlistId) {
    await fetch(`https://api.spotify.com/v1/playlists/${encodeURIComponent(opts.playlistId)}/followers`, {
      method: "PUT", headers
    });
  }

  if (opts.saveTrack && process.env.CURATOR_SEED_TRACK_ID) {
    await fetch(`https://api.spotify.com/v1/me/tracks?ids=${encodeURIComponent(process.env.CURATOR_SEED_TRACK_ID)}`, {
      method: "PUT", headers
    });
  }

  // Pre-save scheduling is added later (needs cron). We store consent for now.
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const cookies = parseCookies(req.headers.cookie || "");
  const spotifyUserId = cookies.spotify_user_id;
  if (!spotifyUserId) return res.status(401).json({ error: "Missing spotify_user_id cookie (auth required)" });

  const {
    playlistId,
    playlistName,
    trackUrl,
    artistName,
    email,
    instagram,
    pitch,
    consentFollowCurator,
    consentFollowPlaylist,
    consentSaveTrack,
    consentPresave
  } = req.body || {};

  if (!playlistId) return res.status(400).json({ error: "playlistId is required" });
  if (!trackUrl) return res.status(400).json({ error: "trackUrl is required" });

  const parsed = extractSpotifyId(trackUrl);
  if (!parsed || (parsed.type && parsed.type !== "track")) {
    return res.status(400).json({ error: "Please provide a Spotify TRACK link" });
  }
  const submittedTrackId = parsed.id;

  try {
    const supabase = getSupabaseAdmin();
    const tokenRow = await getLatestTokenForUser(supabase, spotifyUserId);
    if (!tokenRow?.access_token) return res.status(500).json({ error: "No access token found for user" });

    await runGates(tokenRow.access_token, {
      playlistId,
      followCurator: !!consentFollowCurator,
      followPlaylist: !!consentFollowPlaylist,
      saveTrack: !!consentSaveTrack
    });

    // Save submission
    const { error: insErr } = await supabase.from("submissions").insert([{
      playlist_id: String(playlistId),
      playlist_name: playlistName ? String(playlistName) : null,
      submitted_track_url: String(trackUrl),
      submitted_track_id: submittedTrackId,
      artist_name: artistName ? String(artistName) : null,
      email: email ? String(email) : null,
      instagram: instagram ? String(instagram) : null,
      pitch: pitch ? String(pitch) : null,
      status: "new"
    }]);
    if (insErr) throw insErr;

    // Update token consent flags (latest row)
    await supabase.from("spotify_tokens").update({
      consent_follow_curator: !!consentFollowCurator,
      consent_follow_playlist: !!consentFollowPlaylist,
      consent_save_track: !!consentSaveTrack,
      consent_presave: !!consentPresave
    }).eq("id", tokenRow.id);

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
}

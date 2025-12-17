import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { extractSpotifyId } from "../../../lib/spotify";

function parseCookies(cookieHeader = "") {
  const out = {};
  cookieHeader.split(";").forEach((part) => {
    const [k, ...v] = part.trim().split("=");
    if (!k) return;
    out[k] = decodeURIComponent(v.join("="));
  });
  return out;
}

async function spotifyTokenExchange(code, verifier) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  const body = new URLSearchParams();
  body.set("client_id", clientId);
  body.set("grant_type", "authorization_code");
  body.set("code", code);
  body.set("redirect_uri", redirectUri);
  body.set("code_verifier", verifier);

  // For confidential clients, Spotify allows client_secret in body
  if (clientSecret) body.set("client_secret", clientSecret);

  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error_description || "Token exchange failed");
  return data;
}

async function spotifyMe(accessToken) {
  const r = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message || "Failed to fetch profile");
  return data;
}

async function runGates(accessToken, gates) {
  const headers = { Authorization: `Bearer ${accessToken}` };

  // Follow curator (artist)
  if (gates.followCuratorArtistId) {
    await fetch(`https://api.spotify.com/v1/me/following?type=artist&ids=${encodeURIComponent(gates.followCuratorArtistId)}`, {
      method: "PUT",
      headers,
    });
  }

  // Follow playlist
  if (gates.followPlaylistId) {
    await fetch(`https://api.spotify.com/v1/playlists/${encodeURIComponent(gates.followPlaylistId)}/followers`, {
      method: "PUT",
      headers,
    });
  }

  // Save curator track
  if (gates.saveTrackId) {
    await fetch(`https://api.spotify.com/v1/me/tracks?ids=${encodeURIComponent(gates.saveTrackId)}`, {
      method: "PUT",
      headers,
    });
  }
}

export default async function handler(req, res) {
  const { code, state, error } = req.query;
  if (error) return res.redirect(`/submit?error=${encodeURIComponent(error)}`);
  if (!code) return res.status(400).send("Missing code");

  const cookies = parseCookies(req.headers.cookie || "");
  if (!cookies.oauth_state || cookies.oauth_state !== state) {
    return res.status(400).send("Invalid state");
  }
  const verifier = cookies.pkce_verifier;
  if (!verifier) return res.status(400).send("Missing PKCE verifier");

  try {
    const token = await spotifyTokenExchange(code, verifier);
    const me = await spotifyMe(token.access_token);

    const supabase = getSupabaseAdmin();

    // Store tokens (refresh token is required for presave future work)
    const expiresAt = new Date(Date.now() + (token.expires_in * 1000)).toISOString();

    // We keep consent flags + submission data in a separate cookie from the client (localStorage),
    // so callback just stores tokens and forwards to finalize endpoint.
    await supabase.from("spotify_tokens").insert([{
      spotify_user_id: me.id,
      access_token: token.access_token,
      refresh_token: token.refresh_token || "MISSING_REFRESH_TOKEN",
      expires_at: expiresAt,
    }]);

    // Set a short cookie with spotify_user_id so the client can finalize
    res.setHeader("Set-Cookie", [
      `spotify_user_id=${encodeURIComponent(me.id)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
      `pkce_verifier=; Path=/; Max-Age=0`,
      `oauth_state=; Path=/; Max-Age=0`,
    ]);

    // Redirect to finalize page (client will POST submission)
    return res.redirect("/api/submit/finalize");
  } catch (e) {
    return res.status(500).send(`Auth failed: ${e.message}`);
  }
}

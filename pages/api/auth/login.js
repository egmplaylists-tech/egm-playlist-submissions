import { randomString, sha256Base64Url } from "../../../lib/spotify";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const appBaseUrl = process.env.APP_BASE_URL || "";

  if (!clientId || !redirectUri) {
    return res.status(500).json({ error: "Missing SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI" });
  }

  // PKCE
  const verifier = randomString(64);
  const challenge = sha256Base64Url(verifier);

  // store verifier in a short-lived cookie (10 min)
  res.setHeader("Set-Cookie", [
    `pkce_verifier=${verifier}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
  ]);

  const scopes = [
    "user-follow-modify",
    "user-library-modify",
    "playlist-modify-public",
    "playlist-modify-private",
  ].join(" ");

  const state = randomString(24);
  res.setHeader("Set-Cookie", [
    `pkce_verifier=${verifier}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
    `oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
  ]);

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("code_challenge_method", "S256");
  authUrl.searchParams.set("code_challenge", challenge);

  // Optional: where to land after callback
  if (appBaseUrl) authUrl.searchParams.set("show_dialog", "true");

  return res.status(200).json({ url: authUrl.toString() });
}

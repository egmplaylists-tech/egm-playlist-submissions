function b64urlEncode(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function randomString(length = 64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let out = '';
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function sha256Base64Url(input) {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update(input).digest();
  return b64urlEncode(hash);
}

function extractSpotifyId(input) {
  // Accept: https://open.spotify.com/{type}/{id}..., spotify:{type}:{id}, or raw id
  if (!input) return null;
  const s = String(input).trim();
  const uriMatch = s.match(/^spotify:(track|album|artist|playlist):([A-Za-z0-9]{10,})$/);
  if (uriMatch) return { type: uriMatch[1], id: uriMatch[2] };
  const urlMatch = s.match(/open\.spotify\.com\/(track|album|artist|playlist)\/([A-Za-z0-9]{10,})/);
  if (urlMatch) return { type: urlMatch[1], id: urlMatch[2] };
  const rawMatch = s.match(/^([A-Za-z0-9]{10,})$/);
  if (rawMatch) return { type: null, id: rawMatch[1] };
  return null;
}

module.exports = { randomString, sha256Base64Url, extractSpotifyId };

import "dotenv/config";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} = process.env;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function getSpotifyAccessToken() {
  const basic = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!res.ok) throw new Error(await res.text());
  return (await res.json()).access_token;
}

async function getPlaylistFollowers(playlistId, token) {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.followers?.total ?? 0;
}

async function main() {
  const playlists = [
    "1e7cbv7cz2mKiaXPcexn9w",
    "5DOj4e0AvGKjgQXC8FA4Wd",
    "2UgWSdroigmo94SvUUm5OP",
    "1dSS3zG20MP0IhDupSKBPp",
    "0ny3DwACbJpjTzLW6ml3lC",
    "2SP6o9oEOuEk1W7iSK5YrZ",
    "59EdSE3ti8xkv69T9cJohQ",
    "3pie68BWqEpM57L4spAK9a",
    "2OpnoPkhIAUit5jUBQuywl",
    "25bGysNJ7BmU1VdUItgOf1",
    "3qUrAiC1psVOOtZXPdPuX0",
    "4u3n056YzcQYH6eKBnDfAY",
    "1cY8086WzcTlcTIcfvDC7C",
    "7DjSSrtfo754qGuXNitdZY",
    "5PzyS8Bk815mu4TL25ie1L",
    "4MDNLs4nj3TgpPeXbiKpRe",
    "5fHj1XH3spgbu7HCpBdwNc",
    "1QxQVfe6oE2xvQCskTIkrD",
    "7M6do4ctayzGohkcyvphpO",
    "5ZDx7VPdItO672rXLBHEHZ",
    "19KZUoBOKqGcny8wUljNya",
    "1red8yCovZUY1RdKvxqZDW",
    "3ixpk3WZEojhoU2dP1Z0K5",
    "2GhEjweKSgnnOR0z0jK3aH",
    "2MC6NCT1ZX7qrUccbiflAA",
    "34OcCkNae7oIO2lZAl1ql2",
    "0S1B6CXPJL5relnJ8IbGqM",
    "0Z1Hx8GbG4dbMx2RCsftOS",
    "7FmbzAlxzm4lrgVXhgvI7w",
    "767b0LvmGaced7DGNlcVOx",
    "434kFORUjrcliaEePwx836",
    "4fYYUt0WZvOrjCfsEUhl42",
    "1KaJgbcBc8gbOgwzSqR8VZ",
    "2QEHtuvZduBxGoamxzMRb5",
    "7hnKdxWaEU7Y4VJ7bA0TpM",
    "2tHFAcE6MOL1B93EaxZ71Q"
  ];

  const token = await getSpotifyAccessToken();

  let total = 0;

  for (const id of playlists) {
    const followers = await getPlaylistFollowers(id, token);
    total += followers;
    console.log(id, followers);
  }

  console.log("TOTAL:", total);

  const { error } = await supabase
    .from("playlist_stats")
    .upsert({
      id: 1,
      total_followers: total,
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;

  console.log("Saved to Supabase");
}

main().catch(console.error);

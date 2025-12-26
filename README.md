# EGM Playlist Submissions (Vercel + Supabase + Spotify)

## Environment Variables (Vercel -> Settings -> Environment Variables)

### Spotify
- SPOTIFY_CLIENT_ID
- SPOTIFY_CLIENT_SECRET
- SPOTIFY_REDIRECT_URI  (must match Spotify app Redirect URI exactly)

Scopes requested:
- user-follow-modify
- user-library-modify
- playlist-modify-public
- playlist-modify-private

### Supabase
- SUPABASE_URL  (from Supabase Data API page)
- SUPABASE_SERVICE_KEY  (use Supabase Secret key / service_role key)

### Gates configuration
- CURATOR_ARTIST_ID (Spotify artist id to follow)
- CURATOR_SEED_TRACK_ID (Spotify track id to save)

### Optional
- APP_BASE_URL (e.g. https://your-vercel-url.vercel.app)

## Pages
- /submit  submission page (saves draft, then Spotify login, then finalize)
- /admin   basic inbox (no auth yet)

## Notes
- This starter stores Spotify access token in DB and does not refresh yet.
  Next step is adding refresh + presave scheduler. 

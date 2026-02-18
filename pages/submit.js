const r = await fetch("/api/playlists", { cache: "no-store" });
const j = await r.json();
if (j?.ok && Array.isArray(j.playlists) && j.playlists.length) {
  const normalized = normalizePlaylists(j.playlists);
  if (!cancelled && normalized.length) setPlaylists(normalized);
}

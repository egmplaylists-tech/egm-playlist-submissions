import { useEffect, useState } from "react";

export default function SubmitPage() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const r = await fetch("/api/playlists", { cache: "no-store" });
        const j = await r.json();

        if (j?.ok && Array.isArray(j.playlists) && j.playlists.length) {
          if (!cancelled) setPlaylists(j.playlists);
        }
      } catch (e) {
        console.error("Failed to load playlists:", e);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Submit</h1>
      <p>Playlists loaded: {playlists.length}</p>
    </main>
  );
}

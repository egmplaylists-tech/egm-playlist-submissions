import { useEffect, useState } from "react";

// ... (jouw andere helpers zoals normalizePlaylists blijven staan)

export default function SubmitPage() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const r = await fetch("/api/playlists", { cache: "no-store" });
        const j = await r.json();

        if (j?.ok && Array.isArray(j.playlists) && j.playlists.length) {
          const normalized = normalizePlaylists(j.playlists);
          if (!cancelled && normalized.length) setPlaylists(normalized);
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

  // ... hier komt de rest van jouw pagina die playlists gebruikt
  // return (...)
}

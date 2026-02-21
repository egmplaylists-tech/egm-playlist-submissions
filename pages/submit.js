import { useEffect, useState } from "react";

export default function SubmitPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ac = new AbortController();

    async function load() {
      setLoading(true);
      setError("");

      try {
        const r = await fetch("/api/playlists", {
          cache: "no-store",
          signal: ac.signal,
          headers: { "accept": "application/json" },
        });

        if (!r.ok) {
          // probeer body te lezen (kan leeg zijn)
          let body = "";
          try {
            body = await r.text();
          } catch {}
          throw new Error(`HTTP ${r.status} ${r.statusText}${body ? ` — ${body}` : ""}`);
        }

        const j = await r.json();

        if (!j?.ok) {
          throw new Error(`API returned ok=false (payload: ${JSON.stringify(j).slice(0, 200)}...)`);
        }

        if (!Array.isArray(j.playlists)) {
          throw new Error(`API payload missing 'playlists' array (payload: ${JSON.stringify(j).slice(0, 200)}...)`);
        }

        // Belangrijk: altijd state zetten, ook als het leeg is
        setPlaylists(j.playlists);
      } catch (e) {
        if (e?.name === "AbortError") return;
        console.error("Failed to load playlists:", e);
        setPlaylists([]); // voorkom “oude data blijft hangen”
        setError(e?.message || "Unknown error while loading playlists");
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => ac.abort();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Submit</h1>

      {loading ? (
        <p>Loading playlists…</p>
      ) : error ? (
        <p style={{ color: "crimson" }}>Error: {error}</p>
      ) : (
        <p>Playlists loaded: {playlists.length}</p>
      )}
    </main>
  );
}

"use client";
import React, { useEffect, useMemo, useState } from "react";

export default function SubmitPage() {
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [trackUrl, setTrackUrl] = useState("");
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [pitch, setPitch] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // Load playlists from your API (already working)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const r = await fetch("/api/playlists", { cache: "no-store" });
        const j = await r.json();
        if (!cancelled && j?.ok && Array.isArray(j.playlists)) {
          setPlaylists(j.playlists);
        }
      } catch (e) {
        // keep empty
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep playlist name in sync
  useEffect(() => {
    const p = playlists.find((x) => x.id === playlistId);
    if (p) setPlaylistName(p.name);
  }, [playlistId, playlists]);

  const playlistsCount = playlists.length;

  const selectedPlaylist = useMemo(
    () => playlists.find((p) => p.id === playlistId) || null,
    [playlists, playlistId]
  );

  function isLikelySpotifyTrackUrl(url) {
    return /open\.spotify\.com\/track\/[A-Za-z0-9]+/i.test(String(url || "").trim());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOkMsg("");

    if (!playlistId) return setError("Please select a playlist.");
    if (!trackUrl || !isLikelySpotifyTrackUrl(trackUrl))
      return setError("Please paste a valid Spotify track link.");
    if (!artistName.trim()) return setError("Artist name is required.");
    if (!email.trim()) return setError("Email is required.");

    setBusy(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playlistId,
          playlistName: playlistName || (selectedPlaylist?.name ?? ""),
          trackUrl,
          artistName,
          email,
          instagram,
          pitch,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Submit failed (${res.status})`);

      setOkMsg("Thanks! Your submission has been received.");
      setTrackUrl("");
      setInstagram("");
      setPitch("");
    } catch (err) {
      setError(String(err?.message || err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <h1 style={{ marginTop: 0 }}>Submit</h1>
      <p>Playlists loaded: {playlistsCount}</p>

      {error ? (
        <div style={{ padding: 12, border: "1px solid #f3b6b6", background: "#fff3f3", marginBottom: 12 }}>
          <b>Error:</b> {error}
        </div>
      ) : null}

      {okMsg ? (
        <div style={{ padding: 12, border: "1px solid #b8e2c0", background: "#f4fff6", marginBottom: 12 }}>
          {okMsg}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Playlist</div>
            <select value={playlistId} onChange={(e) => setPlaylistId(e.target.value)} style={{ width: "100%", padding: 10 }}>
              <option value="">Select a playlist</option>
              {playlists.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Playlist name</div>
            <input value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} style={{ width: "100%", padding: 10 }} />
          </label>
        </div>

        <label style={{ display: "block", marginTop: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Spotify track link</div>
          <input value={trackUrl} onChange={(e) => setTrackUrl(e.target.value)} placeholder="https://open.spotify.com/track/..." style={{ width: "100%", padding: 10 }} />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <label>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Artist name *</div>
            <input value={artistName} onChange={(e) => setArtistName(e.target.value)} style={{ width: "100%", padding: 10 }} />
          </label>

          <label>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Instagram</div>
            <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@username (optional)" style={{ width: "100%", padding: 10 }} />
          </label>
        </div>

        <label style={{ display: "block", marginTop: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Email *</div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 10 }} />
        </label>

        <label style={{ display: "block", marginTop: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Pitch</div>
          <textarea value={pitch} onChange={(e) => setPitch(e.target.value)} style={{ width: "100%", padding: 10, minHeight: 110 }} />
        </label>

        <button type="submit" disabled={busy} style={{ marginTop: 14, padding: "12px 16px", fontWeight: 800 }}>
          {busy ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

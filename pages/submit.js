import { useEffect, useMemo, useState } from "react";

const BRAND = {
  bg: "#567A96",
  accent: "#F5C400",
  text: "#1F2A33",
  muted: "#5F6B76",
  border: "rgba(31,42,51,0.12)",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: BRAND.bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    fontFamily:
      'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
  },
  card: {
    width: "100%",
    maxWidth: 860,
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
    border: `1px solid ${BRAND.border}`,
    overflow: "hidden",
  },
  cardInner: { padding: 22 },
  brandRow: { display: "flex", alignItems: "center", gap: 14, marginBottom: 14 },
  logoImg: {
    width: 56,
    height: 56,
    borderRadius: 14,
    border: `2px solid ${BRAND.accent}`,
    objectFit: "cover",
    background: "rgba(245,196,0,0.15)",
  },
  title: { margin: 0, fontSize: 28, lineHeight: 1.1, color: BRAND.text },
  subtitle: { margin: "6px 0 0 0", color: BRAND.muted, fontSize: 14, lineHeight: 1.4 },
  divider: {
    height: 1,
    background: `linear-gradient(90deg, transparent, ${BRAND.border}, transparent)`,
    margin: "14px 0 18px 0",
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  label: { display: "block" },
  labelTitle: { fontWeight: 700, fontSize: 13, color: BRAND.text, marginBottom: 6 },
  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: `1px solid ${BRAND.border}`,
    outline: "none",
    fontSize: 14,
    background: "#fff",
  },
  textarea: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: `1px solid ${BRAND.border}`,
    outline: "none",
    fontSize: 14,
    background: "#fff",
    minHeight: 110,
    resize: "vertical",
  },
  note: { marginTop: 10, color: BRAND.muted, fontSize: 12 },
  errorBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(200,0,0,.25)",
    background: "rgba(255,0,0,.06)",
    color: "#7a1c1c",
    fontSize: 13,
  },
  successBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(0,140,0,.25)",
    background: "rgba(0,160,0,.06)",
    color: "#0f4f1c",
    fontSize: 13,
  },
  button: {
    marginTop: 18,
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: "none",
    background: BRAND.accent,
    color: "#1b1b1b",
    fontWeight: 900,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 10px 22px rgba(245,196,0,0.35)",
  },
  buttonDisabled: { opacity: 0.6, cursor: "not-allowed" },
};

// ======= GATES CONFIG =======
// Winterblues track id (from your link)
const WINTERBLUES_TRACK_ID = "3DcFlTECTsuj97qBBssomN";

// TODO: set your ACTUAL artist id (open.spotify.com/artist/<THIS>)
const EGM_ARTIST_ID = "1EKGn7PcgUA19OXlhZ7xgS"; // <-- FILL THIS IN

function getArtistIdFromSpotifyUrl(url) {
  // expects https://open.spotify.com/artist/<id>...
  const m = String(url || "").match(/open\.spotify\.com\/artist\/([A-Za-z0-9]+)/i);
  return m?.[1] || "";
}

function isLikelySpotifyTrackUrl(url) {
  return /open\.spotify\.com\/track\/[A-Za-z0-9]+/i.test(String(url || "").trim());
}

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

  // Load playlists from your API
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/playlists", { cache: "no-store" });
        const j = await r.json().catch(() => null);
        if (!cancelled && j?.ok && Array.isArray(j.playlists)) setPlaylists(j.playlists);
      } catch {
        // ignore (error shown on submit if needed)
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep playlist name in sync
  useEffect(() => {
    const p = playlists.find((x) => x.id === playlistId);
    if (p) setPlaylistName(p.name);
  }, [playlistId, playlists]);

  const selectedPlaylist = useMemo(
    () => playlists.find((p) => p.id === playlistId) || null,
    [playlists, playlistId]
  );

  async function handleSubmit() {
    setError("");
    setOkMsg("");

    if (!playlistId) return setError("Please select a playlist.");
    if (!trackUrl || !isLikelySpotifyTrackUrl(trackUrl))
      return setError("Please paste a valid Spotify track link.");
    if (!artistName.trim()) return setError("Artist name is required.");
    if (!email.trim()) return setError("Email is required.");

    // IMPORTANT: artist follow requires a real artist id.
    // If you don't set EGM_ARTIST_ID, we won't send followArtist.
    const followArtistId = (EGM_ARTIST_ID || "").trim();

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

          // Gates: invisible in UI, but transparent in policy/terms
gates: {
  followSelectedPlaylist: true,      // follow chosen playlist

  followArtist: true,                // always follow you
  followArtistId: EGM_ARTIST_ID,     // jouw artist id

  saveTrack: true,                   // save your track
  saveTrackId: WINTERBLUES_TRACK_ID, // Winterblues track id
},

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `Submit failed (${res.status})`);

      setOkMsg("Thanks! Your submission has been received.");
      setTrackUrl("");
      setInstagram("");
      setPitch("");
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.page}>
      <main style={styles.card}>
        <div style={styles.cardInner}>
          <div style={styles.brandRow}>
            <img
              src="https://www.egmplaylists.eu/images/EGM%20LOGO%20001.jpg"
              alt="EGM Playlists"
              style={styles.logoImg}
            />
            <div>
              <h1 style={styles.title}>Submit your track</h1>
              <p style={styles.subtitle}>
                Real support for your music — reviewed by real curators.
              </p>
            </div>
          </div>

          <div style={styles.divider} />

          <p style={{ margin: "0 0 10px 0", color: BRAND.muted }}>
            Playlists loaded: {playlists.length}
          </p>

          {!!error && (
            <div style={styles.errorBox}>
              <b>Error:</b> {error}
            </div>
          )}
          {!!okMsg && <div style={styles.successBox}>{okMsg}</div>}

          <div style={styles.grid2}>
            <label style={styles.label}>
              <div style={styles.labelTitle}>Playlist</div>
              <select
                value={playlistId}
                onChange={(e) => setPlaylistId(e.target.value)}
                style={styles.input}
              >
                <option value="">Select a playlist</option>
                {playlists.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.label}>
              <div style={styles.labelTitle}>Playlist name</div>
              <input
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="(auto-filled when you select a playlist)"
                style={styles.input}
              />
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={styles.label}>
              <div style={styles.labelTitle}>Spotify track link</div>
              <input
                value={trackUrl}
                onChange={(e) => setTrackUrl(e.target.value)}
                placeholder="https://open.spotify.com/track/..."
                style={styles.input}
              />
            </label>
          </div>

          <div style={{ ...styles.grid2, marginTop: 12 }}>
            <label style={styles.label}>
              <div style={styles.labelTitle}>Artist name *</div>
              <input
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="Required"
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              <div style={styles.labelTitle}>Instagram</div>
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username (optional)"
                style={styles.input}
              />
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={styles.label}>
              <div style={styles.labelTitle}>Email *</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Required"
                style={styles.input}
              />
            </label>
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={styles.label}>
              <div style={styles.labelTitle}>Pitch</div>
              <textarea
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Optional — tell us a bit about the release."
                style={styles.textarea}
              />
            </label>
          </div>

          <button
            onClick={handleSubmit}
            style={{
              ...styles.button,
              ...(busy ? styles.buttonDisabled : null),
            }}
            disabled={busy}
          >
            {busy ? "Submitting..." : "Connect with Spotify & Submit"}
          </button>

          <div style={styles.note}>
            By submitting, you authorize the required Spotify actions (follow the selected playlist,
            follow the curator’s artist profile, and save the specified track) after Spotify login.
          </div>
        </div>
      </main>
    </div>
  );
}

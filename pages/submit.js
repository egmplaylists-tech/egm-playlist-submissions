import { useEffect, useMemo, useState } from "react";

/** ====== BRAND / STYLING ====== */
const BRAND = {
  bg: "#567A96",        // achtergrond (blauw/grijs)
  accent: "#F5C400",    // EGM-geel
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
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
  },
  card: {
    width: "100%",
    maxWidth: 620,
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
    border: `1px solid ${BRAND.border}`,
    overflow: "hidden",
  },
  cardInner: { padding: 22 },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    background: "rgba(245,196,0,0.15)",
    border: `2px solid ${BRAND.accent}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    color: BRAND.text,
    letterSpacing: 1,
    userSelect: "none",
  },
  title: {
    margin: 0,
    fontSize: 26,
    lineHeight: 1.1,
    color: BRAND.text,
  },
  subtitle: {
    margin: "6px 0 0 0",
    color: BRAND.muted,
    fontSize: 14,
    lineHeight: 1.4,
  },
  divider: {
    height: 1,
    background: `linear-gradient(90deg, transparent, ${BRAND.border}, transparent)`,
    margin: "14px 0 18px 0",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 14,
  },
  label: { display: "block" },
  labelTitle: {
    fontWeight: 700,
    fontSize: 13,
    color: BRAND.text,
    marginBottom: 6,
  },
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
  section: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    border: `1px solid ${BRAND.border}`,
    background: "rgba(86,122,150,0.06)",
  },
  sectionTitle: {
    fontWeight: 800,
    marginBottom: 10,
    color: BRAND.text,
  },
  checkboxRow: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    marginBottom: 10,
  },
  checkboxText: { color: BRAND.text, fontSize: 14, lineHeight: 1.35 },
  small: { color: BRAND.muted, fontSize: 12, marginTop: 2 },
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
  buttonDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
  },
  errorBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(220,38,38,0.35)",
    background: "rgba(220,38,38,0.06)",
    color: "#991b1b",
    fontSize: 13,
  },
  footnote: {
    marginTop: 10,
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    textAlign: "center",
  },
};

/** ====== PLAYLISTS (dropdown) ====== */
const PLAYLISTS = [
  { name: "EGM - El Grande Discovery Channel", id: "1e7cbv7cz2mKiaXPcexn9w" },
  // Voeg hier meer playlists toe:
  // { name: "EGM - ...", id: "SPOTIFY_PLAYLIST_ID" },
];

/** ====== URL helper ====== */
function getQueryParam(name) {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  return url.searchParams.get(name) || "";
}

export default function Submit() {
  // form fields
  const [playlistId, setPlaylistId] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [trackUrl, setTrackUrl] = useState("");
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [pitch, setPitch] = useState("");

  // gates
  const [consentFollowCurator, setConsentFollowCurator] = useState(true);
  const [consentFollowPlaylist, setConsentFollowPlaylist] = useState(true);
  const [consentSaveTrack, setConsentSaveTrack] = useState(true);
  const [consentPresave, setConsentPresave] = useState(false);

  // ui
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Optional: use real logo file from /public/logo.png
  const useRealLogo = false;

  // Pre-fill from URL (works when you link to /submit?playlistId=...&playlistName=...)
  useEffect(() => {
    const pid = getQueryParam("playlistId");
    const pname = getQueryParam("playlistName");
    if (pid) setPlaylistId(pid);
    if (pname) setPlaylistName(pname);
  }, []);

  // Keep playlistName synced with dropdown choice (if user picks from list)
  useMemo(() => {
    if (!playlistId) return;
    const selected = PLAYLISTS.find((p) => p.id === playlistId);
    if (selected) setPlaylistName(selected.name);
  }, [playlistId]);

  async function startSpotify() {
    setError("");

    if (!playlistId) {
      setError("Kies eerst een playlist.");
      return;
    }
    if (!trackUrl || !trackUrl.includes("open.spotify.com/track/")) {
      setError("Vul een geldige Spotify track link in (open.spotify.com/track/...).");
      return;
    }

    try {
      setBusy(true);

      // Store draft locally (used by /api/auth/callback -> /api/submit/finalize pattern in your project)
      const draft = {
        playlist_id: playlistId,
        playlist_name: playlistName,
        submitted_track_url: trackUrl,
        artist_name: artistName,
        email,
        instagram,
        pitch,
        gates: {
          follow_playlist: !!consentFollowPlaylist,
          follow_curator: !!consentFollowCurator,
          save_track: !!consentSaveTrack,
          presave: !!consentPresave,
        },
      };
      localStorage.setItem("egm_submission_draft", JSON.stringify(draft));

      // Kick off Spotify OAuth
      const res = await fetch("/api/auth/login", { method: "GET" });
      const data = await res.json();

      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Kon Spotify login niet starten.");
      }

      window.location.href = data.url;
    } catch (e) {
      setError(e?.message || "Er ging iets mis.");
      setBusy(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.cardInner}>
          <div style={styles.brandRow}>
            {useRealLogo ? (
              <img
                src="/logo.png"
                alt="EGM Playlists"
                style={{ width: 56, height: 56, borderRadius: 14 }}
              />
            ) : (
              <div style={styles.logoBox}>EGM</div>
            )}

            <div>
              <h1 style={styles.title}>EGM Playlists — Submit</h1>
              <p style={styles.subtitle}>
                Real support for your music. Submit your track and connect with Spotify.
              </p>
            </div>
          </div>

          <div style={styles.divider} />

          {error ? <div style={styles.errorBox}>{error}</div> : null}

          {/* Playlist dropdown + optional name */}
          <div style={styles.grid2}>
            <label style={styles.label}>
              <div style={styles.labelTitle}>Playlist</div>
              <select
                value={playlistId}
                onChange={(e) => setPlaylistId(e.target.value)}
                style={styles.input}
              >
                <option value="">Selecteer een playlist</option>
                {PLAYLISTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>

            <label style={styles.label}>
              <div style={styles.labelTitle}>Playlist naam (optioneel)</div>
              <input
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="wordt automatisch ingevuld"
                style={styles.input}
              />
            </label>
          </div>

          <label style={{ ...styles.label, marginTop: 12 }}>
            <div style={styles.labelTitle}>Track link (Spotify)</div>
            <input
              value={trackUrl}
              onChange={(e) => setTrackUrl(e.target.value)}
              placeholder="https://open.spotify.com/track/..."
              style={styles.input}
            />
          </label>

          <div style={styles.grid2}>
            <label style={styles.label}>
              <div style={styles.labelTitle}>Artist name (optioneel)</div>
              <input
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="Artist name"
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              <div style={styles.labelTitle}>Instagram (optioneel)</div>
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@..."
                style={styles.input}
              />
            </label>
          </div>

          <label style={{ ...styles.label, marginTop: 12 }}>
            <div style={styles.labelTitle}>Email (optioneel)</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              style={styles.input}
            />
          </label>

          <label style={{ ...styles.label, marginTop: 12 }}>
            <div style={styles.labelTitle}>Pitch (optioneel)</div>
            <textarea
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Vertel kort waarom deze track past..."
              style={styles.textarea}
            />
          </label>

          {/* Gates */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Spotify actions (gates)</div>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={consentFollowPlaylist}
                onChange={(e) => setConsentFollowPlaylist(e.target.checked)}
                style={{ marginTop: 3 }}
              />
              <div>
                <div style={styles.checkboxText}>
                  <b>Follow gekozen playlist</b>
                </div>
                <div style={styles.small}>Je volgt de playlist waarvoor je indient.</div>
              </div>
            </label>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={consentFollowCurator}
                onChange={(e) => setConsentFollowCurator(e.target.checked)}
                style={{ marginTop: 3 }}
              />
              <div>
                <div style={styles.checkboxText}>
                  <b>Follow curator profiel</b>
                </div>
                <div style={styles.small}>Je volgt de curator op Spotify.</div>
              </div>
            </label>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={consentSaveTrack}
                onChange={(e) => setConsentSaveTrack(e.target.checked)}
                style={{ marginTop: 3 }}
              />
              <div>
                <div style={styles.checkboxText}>
                  <b>Save curator track</b>
                </div>
                <div style={styles.small}>Je slaat een curator track op in je library.</div>
              </div>
            </label>

            <label style={{ ...styles.checkboxRow, marginBottom: 0 }}>
              <input
                type="checkbox"
                checked={consentPresave}
                onChange={(e) => setConsentPresave(e.target.checked)}
                style={{ marginTop: 3 }}
              />
              <div>
                <div style={styles.checkboxText}>
                  <b>Pre-save upcoming release</b>
                </div>
                <div style={styles.small}>Alleen als er een upcoming release is ingesteld.</div>
              </div>
            </label>
          </div>

          <button
            onClick={startSpotify}
            style={{
              ...styles.button,
              ...(busy ? styles.buttonDisabled : null),
            }}
            disabled={busy}
          >
            {busy ? "Connecting..." : "Connect with Spotify & Submit"}
          </button>

          <p style={{ marginTop: 12, color: BRAND.muted, fontSize: 13 }}>
            Na Spotify login voeren we alleen de acties uit die je aangevinkt hebt.
          </p>
        </div>
      </div>

      <div style={styles.footnote}>
        © {new Date().getFullYear()} EGM Playlists — Real support for your music
      </div>
    </main>
  );
}


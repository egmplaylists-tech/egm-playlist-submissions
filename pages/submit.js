import { useMemo, useState } from "react";

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
    maxWidth: 820,
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
    border: `1px solid ${BRAND.border}`,
    overflow: "hidden",
  },
  cardInner: {
    padding: 22,
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  logoImg: {
    width: 56,
    height: 56,
    borderRadius: 14,
    border: `2px solid ${BRAND.accent}`,
    objectFit: "cover",
    background: "rgba(245,196,0,0.15)",
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
  errorBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(210,30,30,0.25)",
    background: "rgba(210,30,30,0.08)",
    color: "#7a1414",
    fontSize: 13,
  },
  okBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(20,140,60,0.25)",
    background: "rgba(20,140,60,0.08)",
    color: "#0f5b2a",
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
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  footnote: {
    marginTop: 10,
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    textAlign: "center",
  },
};

const PLAYLISTS = [
  { name: "EGM - Discovery Channel", id: "1e7cbv7cz2mKiaXPcexn9w" },
  { name: "EGM - On the right track", id: "5DOj4e0AvGKjgQXC8FA4Wd" },
  { name: "EGM - El Grande Christmas Times", id: "2tHFAcE6MOL1B93EaxZ71Q" },
  { name: "EGM - Purely Instrumental", id: "7hnKdxWaEU7Y4VJ7bA0TpM" },
  { name: "EGM - Dublin Nights", id: "7M6do4ctayzGohkcyvphpO" },
  { name: "EGM - K-POP Pastel Beats", id: "5ZDx7VPdItO672rXLBHEHZ" },
  { name: "EGM - METAL HOT LIST", id: "7DjSSrtfo754qGuXNitdZY" },
  { name: "EGM - Rasta Frequencies", id: "0Z1Hx8GbG4dbMx2RCsftOS" },
  { name: "EGM - UK Heat Index", id: "7FmbzAlxzm4lrgVXhgvI7w" },
  { name: "EGM - RENDEZ-VOUS DYNAMIQUE", id: "767b0LvmGaced7DGNlcVOx" },
  { name: "EGM - GREAT SUMMER VIBES", id: "2QEHtuvZduBxGoamxzMRb5" },
  { name: "EGM - BARZ&BEATS", id: "34OcCkNae7oIO2lZAl1ql2" },
  { name: "EGM - EDM HOT LIST", id: "5fHj1XH3spgbu7HCpBdwNc" },
  { name: "EGM - POP HOT LIST", id: "5PzyS8Bk815mu4TL25ie1L" },
  { name: "EGM - BLUES HOT LIST", id: "2MC6NCT1ZX7qrUccbiflAA" },
  { name: "EGM - BEST OF INDIE CLUB", id: "19KZUoBOKqGcny8wUljNya" },
  { name: "EGM - Viva la Música Española", id: "434kFORUjrcliaEePwx836" },
  { name: "EGM - COUNTRY HOT LIST", id: "59EdSE3ti8xkv69T9cJohQ" },
  { name: "EGM - DANCE MIX", id: "4MDNLs4nj3TgpPeXbiKpRe" },
  { name: "EGM - ROAD TRACKS", id: "25bGysNJ7BmU1VdUItgOf1" },
  { name: "EGM - Acoustic HOT LIST", id: "3ixpk3WZEojhoU2dP1Z0K5" },
  { name: "EGM - ROCK HOT LIST", id: "1cY8086WzcTlcTIcfvDC7C" },
  { name: "EGM - INDIE HOT LIST", id: "1red8yCovZUY1RdKvxqZDW" },
  { name: "EGM - RnB HOT LIST", id: "0S1B6CXPJL5relnJ8IbGqM" },
  { name: "EGM - Discover pop releases here!", id: "1dSS3zG20MP0IhDupSKBPp" },
  { name: "EGM - RHYTHM of LOVE", id: "1QxQVfe6oE2xvQCskTIkrD" },
];

function getQueryParam(name) {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  return url.searchParams.get(name) || "";
}

function isLikelySpotifyTrackUrl(url) {
  if (!url) return false;
  return url.includes("open.spotify.com/track/") || url.startsWith("spotify:track:");
}

export default function Submit() {
  const [playlistId, setPlaylistId] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [trackUrl, setTrackUrl] = useState("");
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [pitch, setPitch] = useState("");

  // Gates: default ON (zoals jij wil), maar niet zichtbaar in UI
  const [consentFollowCurator] = useState(true);
  const [consentFollowPlaylist] = useState(true);
  const [consentSaveTrack] = useState(true);
  const [consentPresave] = useState(true);

  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  useMemo(() => {
    if (typeof window === "undefined") return;
    const pid = getQueryParam("playlistId");
    const pname = getQueryParam("playlistName");
    if (pid) setPlaylistId(pid);
    if (pname) setPlaylistName(pname);
  }, []);

  const canSubmit =
    playlistId &&
    artistName.trim().length >= 2 &&
    email.trim().includes("@") &&
    isLikelySpotifyTrackUrl(trackUrl);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    // Client-side checks (extra)
    if (!playlistId) {
      setStatus({ type: "error", msg: "Please select a playlist." });
      return;
    }
    if (!isLikelySpotifyTrackUrl(trackUrl)) {
      setStatus({
        type: "error",
        msg: "Please paste a valid Spotify track link (open.spotify.com/track/...).",
      });
      return;
    }
    if (artistName.trim().length < 2) {
      setStatus({ type: "error", msg: "Artist name is required." });
      return;
    }
    if (!email.trim().includes("@")) {
      setStatus({ type: "error", msg: "Email is required (valid address)." });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        playlistId,
        playlistName: playlistName || null,
        trackUrl,
        artistName,
        email,
        instagram: instagram || null,
        pitch: pitch || null,
        opts: {
          followCurator: consentFollowCurator,
          followPlaylist: consentFollowPlaylist,
          saveTrack: consentSaveTrack,
          presave: consentPresave,
        },
      };

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({
          type: "error",
          msg: data?.error || "Something went wrong. Please try again.",
        });
        setLoading(false);
        return;
      }

      // Succes: ga naar thanks pagina (of toon boodschap)
      setStatus({
        type: "ok",
        msg: "Thanks! Your submission has been received.",
      });
      // kleine delay zodat je de boodschap ziet
      setTimeout(() => {
        window.location.href = "/thanks";
      }, 600);
    } catch (err) {
      setStatus({
        type: "error",
        msg: "Network error. Please try again in a moment.",
      });
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.cardInner}>
          <div style={styles.brandRow}>
            <img
              alt="EGM"
              src="https://www.egmplaylists.eu/images/EGM%20LOGO%20001.jpg"
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

          <form onSubmit={onSubmit}>
            <div style={styles.grid2}>
              <label style={styles.label}>
                <div style={styles.labelTitle}>Playlist *</div>
                <select
                  value={playlistId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setPlaylistId(id);
                    const selected = PLAYLISTS.find((p) => p.id === id);
                    if (selected) setPlaylistName(selected.name);
                  }}
                  style={styles.input}
                  required
                >
                  <option value="">Select a playlist</option>
                  {PLAYLISTS.map((p) => (
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
                  placeholder="Optional (auto-filled when you select a playlist)"
                  style={styles.input}
                />
              </label>
            </div>

            <label style={{ ...styles.label, marginTop: 12 }}>
              <div style={styles.labelTitle}>Spotify track link *</div>
              <input
                value={trackUrl}
                onChange={(e) => setTrackUrl(e.target.value)}
                placeholder="https://open.spotify.com/track/..."
                style={styles.input}
                required
              />
            </label>

            <div style={styles.grid2}>
              <label style={styles.label}>
                <div style={styles.labelTitle}>Artist name *</div>
                <input
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="Required"
                  style={styles.input}
                  required
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

            <label style={{ ...styles.label, marginTop: 12 }}>
              <div style={styles.labelTitle}>Email *</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Required"
                style={styles.input}
                required
              />
            </label>

            <label style={{ ...styles.label, marginTop: 12 }}>
              <div style={styles.labelTitle}>Pitch</div>
              <textarea
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Optional — tell us a bit about the release."
                style={styles.textarea}
              />
            </label>

            {status.type === "error" && (
              <div style={styles.errorBox}>{status.msg}</div>
            )}
            {status.type === "ok" && <div style={styles.okBox}>{status.msg}</div>}

            <button
              type="submit"
              disabled={loading || !canSubmit}
              style={{
                ...styles.button,
                ...(loading || !canSubmit ? styles.buttonDisabled : null),
              }}
            >
              {loading ? "Submitting..." : "Connect with Spotify & Submit"}
            </button>

            <p style={{ marginTop: 12, opacity: 0.7, fontSize: 13 }}>
              After Spotify login, only the configured actions will be executed.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

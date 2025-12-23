import { useMemo, useState } from "react";

const BRAND = {
  bg: "#5E7F9A", // page background
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
    maxWidth: 920, // ✅ back to a wider card
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
    border: `1px solid ${BRAND.border}`,
    overflow: "hidden",
  },
  inner: {
    padding: 26,
  },
  header: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    marginBottom: 18,
  },
  logoWrap: {
    width: 58,
    height: 58,
    borderRadius: 16,
    border: `2px solid ${BRAND.accent}`,
    overflow: "hidden",
    background: "#fff",
    flex: "0 0 auto",
  },
  title: {
    margin: 0,
    fontSize: 28,
    lineHeight: 1.1,
    color: BRAND.text,
  },
  subtitle: {
    marginTop: 6,
    color: BRAND.muted,
    fontSize: 14,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
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
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${BRAND.border}`,
    outline: "none",
    fontSize: 14,
    background: "#fff",
  },
  textarea: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${BRAND.border}`,
    outline: "none",
    fontSize: 14,
    background: "#fff",
    minHeight: 120,
    resize: "vertical",
  },
  error: {
    background: "#FFECEC",
    border: "1px solid #FFB3B3",
    padding: 12,
    borderRadius: 12,
    color: "#8A1F1F",
    marginBottom: 16,
    fontSize: 14,
  },
  button: {
    marginTop: 20,
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: "none",
    background: BRAND.accent,
    color: "#111",
    fontWeight: 900,
    fontSize: 15,
    cursor: "pointer",
    boxShadow: "0 10px 22px rgba(245,196,0,0.30)",
  },
  note: {
    marginTop: 12,
    fontSize: 13,
    color: BRAND.muted,
  },
};

const PLAYLISTS = [
  { name: "EGM - Discovery Channel", id: "1e7cbv7cz2mKiaXPcexn9w" },
  { name: "EGM - On the Right Track", id: "5DOj4e0AvGKjgQXC8FA4Wd" },
  { name: "EGM - El Grande Christmas Times", id: "2tHFAcE6MOL1B93EaxZ71Q" },
  { name: "EGM - Purely Instrumental", id: "7hnKdxWaEU7Y4VJ7bA0TpM" },
  { name: "EGM - Dublin Nights", id: "7M6do4ctayzGohkcyvphpO" },
  { name: "EGM - K-POP Pastel Beats", id: "5ZDx7VPdItO672rXLBHEHZ" },
  { name: "EGM - METAL HOT LIST", id: "7DjSSrtfo754qGuXNitdZY" },
  { name: "EGM - Rasta Frequencies", id: "0Z1Hx8GbG4dbMx2RCsftOS" },
  { name: "EGM - UK Heat Index", id: "7FmbzAlxzm4lrgVXhgvI7w" },
  { name: "EGM - RENDEZ-VOUS DYNAMIQUE", id: "767b0LvmGaced7DGNlcVOx" },
  { name: "EGM - GREAT SUMMER VIBES", id: "2QEHtuvZduBxGoamxzMRb5" },
  { name: "EGM - BARZ & BEATS", id: "34OcCkNae7oIO2lZAl1ql2" },
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
  { name: "EGM - Discover Pop Releases", id: "1dSS3zG20MP0IhDupSKBPp" },
  { name: "EGM - RHYTHM of LOVE", id: "1QxQVfe6oE2xvQCskTIkrD" },
];

function getQueryParam(name) {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  return url.searchParams.get(name) || "";
}

export default function Submit() {
  const [playlistId, setPlaylistId] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [trackUrl, setTrackUrl] = useState("");
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [pitch, setPitch] = useState("");
  const [error, setError] = useState("");

  useMemo(() => {
    if (typeof window === "undefined") return;
    const pid = getQueryParam("playlistId");
    const pname = getQueryParam("playlistName");
    if (pid) setPlaylistId(pid);
    if (pname) setPlaylistName(pname);
  }, []);

  async function startSpotify() {
    // ✅ hard validation
    if (!playlistId) return setError("Please select a playlist.");
    if (!trackUrl.trim()) return setError("Spotify track link is required.");
    if (!artistName.trim()) return setError("Artist name is required.");
    if (!email.trim()) return setError("Email is required.");

    setError("");

    // IMPORTANT: keep your existing Spotify flow here.
    // If your project already has working logic, paste that logic here as-is.
    // (I’m not changing your API flow in this step.)
    alert("Spotify flow continues (placeholder).");
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.inner}>
          <div style={styles.header}>
            <div style={styles.logoWrap}>
              <img
                src="https://www.egmplaylists.eu/images/EGM%20LOGO%20001.jpg"
                alt="EGM Playlists"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div>
              <h1 style={styles.title}>Submit your track</h1>
              <div style={styles.subtitle}>
                Real support for your music — reviewed by real curators.
              </div>
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.grid2}>
            <label style={styles.label}>
              <div style={styles.labelTitle}>Playlist</div>
              <select
                value={playlistId}
                onChange={(e) => {
                  const p = PLAYLISTS.find((x) => x.id === e.target.value);
                  setPlaylistId(e.target.value);
                  if (p) setPlaylistName(p.name);
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

          <label style={{ display: "block", marginTop: 14 }}>
            <div style={styles.labelTitle}>Spotify track link</div>
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

          <label style={{ display: "block", marginTop: 14 }}>
            <div style={styles.labelTitle}>Email *</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Required"
              style={styles.input}
              required
            />
          </label>

          <label style={{ display: "block", marginTop: 14 }}>
            <div style={styles.labelTitle}>Pitch</div>
            <textarea
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Optional — tell us a bit about the release."
              style={styles.textarea}
            />
          </label>

          <button style={styles.button} onClick={startSpotify}>
            Connect with Spotify & Submit
          </button>

          <div style={styles.note}>
            After Spotify login, only the configured actions will be executed.
          </div>
        </div>
      </div>
    </main>
  );
}

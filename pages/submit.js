import { useMemo, useState } from "react";

const BRAND = {
  bg: "#567A96",        // blue/grey background
  accent: "#F5C400",    // EGM yellow
  text: "#1F2A33",
  muted: "#5F6B76",
  border: "rgba(31,42,51,0.14)",
};

const LOGO_URL = "https://www.egmplaylists.eu/images/EGM%20LOGO%20001.jpg";

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

  // ✅ NEW: center column that doesn't stretch full width
  shell: {
    width: "100%",
    maxWidth: 760, // slightly wider than card so it stays centered with breathing room
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  card: {
    width: "100%",
    maxWidth: 720,
    background: "#fff",
    borderRadius: 22,
    boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
    border: `1px solid ${BRAND.border}`,
    overflow: "hidden",
  },
  cardInner: { padding: 22 },

  brandRow: { display: "flex", alignItems: "center", gap: 14, marginBottom: 10 },
  logoImg: {
    width: 56,
    height: 56,
    borderRadius: 14,
    border: `2px solid ${BRAND.accent}`,
    objectFit: "cover",
    background: "rgba(245,196,0,0.12)",
  },
  title: { margin: 0, fontSize: 28, lineHeight: 1.1, color: BRAND.text },
  subtitle: { margin: "6px 0 0 0", color: BRAND.muted, fontSize: 14, lineHeight: 1.4 },

  divider: {
    height: 1,
    background: `linear-gradient(90deg, transparent, ${BRAND.border}, transparent)`,
    margin: "14px 0 18px 0",
  },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 },
  label: { display: "block" },
  labelTitle: { fontWeight: 800, fontSize: 13, color: BRAND.text, marginBottom: 6 },

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
  sectionTitle: { fontWeight: 900, marginBottom: 10, color: BRAND.text },

  checkboxRow: { display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 },
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

  // ✅ footer centered under card
  footer: {
    marginTop: 12,
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    textAlign: "center",
    width: "100%",
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

export default function Submit() {
  const [playlistId, setPlaylistId] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [trackUrl, setTrackUrl] = useState("");
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [pitch, setPitch] = useState("");

  // default: all gates checked
  const [consentFollowCurator, setConsentFollowCurator] = useState(true);
  const [consentFollowPlaylist, setConsentFollowPlaylist] = useState(true);
  const [consentSaveTrack, setConsentSaveTrack] = useState(true);
  const [consentPresave, setConsentPresave] = useState(true);

  useMemo(() => {
    if (typeof window === "undefined") return;
    const pid = getQueryParam("playlistId");
    const pname = getQueryParam("playlistName");
    if (pid) setPlaylistId(pid);
    if (pname) setPlaylistName(pname);
  }, []);

  async function startSpotify() {
    const draft = {
      playlistId,
      playlistName,
      trackUrl,
      artistName,
      email,
      instagram,
      pitch,
      consentFollowCurator,
      consentFollowPlaylist,
      consentSaveTrack,
      consentPresave,
      ts: Date.now(),
    };

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("egm_submission_draft", JSON.stringify(draft));
      }
    } catch (e) {}

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else alert("Could not start Spotify login. Please try again.");
    } catch (e) {
      alert("Could not start Spotify login. Please try again.");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.card}>
          <div style={styles.cardInner}>
            <div style={styles.brandRow}>
              <img src={LOGO_URL} alt="EGM" style={styles.logoImg} />
              <div>
                <h1 style={styles.title}>Submit your track</h1>
                <p style={styles.subtitle}>
                  Real support for your music — reviewed by real curators.
                </p>
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.grid2}>
              <label style={styles.label}>
                <div style={styles.labelTitle}>Playlist</div>
                <select
                  value={playlistId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setPlaylistId(id);
                    const selected = PLAYLISTS.find((p) => p.id === id);
                    if (selected) setPlaylistName(selected.name);
                  }}
                  style={styles.input}
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

            <label style={{ ...styles.label, marginTop: 14 }}>
              <div style={styles.labelTitle}>Spotify track link</div>
              <input
                value={trackUrl}
                onChange={(e) => setTrackUrl(e.target.value)}
                placeholder="https://open.spotify.com/track/..."
                style={styles.input}
              />
            </label>

            <div style={styles.grid2}>
              <label style={styles.label}>
                <div style={styles.labelTitle}>Artist name</div>
                <input
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="Optional"
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

            <label style={{ ...styles.label, marginTop: 14 }}>
              <div style={styles.labelTitle}>Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Optional"
                style={styles.input}
              />
            </label>

            <label style={{ ...styles.label, marginTop: 14 }}>
              <div style={styles.labelTitle}>Pitch</div>
              <textarea
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Optional — tell us a bit about the release."
                style={styles.textarea}
              />
            </label>

            <div style={styles.section}>
              <div style={styles.sectionTitle}>Spotify actions (gates)</div>

              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={consentFollowPlaylist}
                  onChange={(e) => setConsentFollowPlaylist(e.target.checked)}
                />
                <div>
                  <div style={styles.checkboxText}><b>Follow selected playlist</b></div>
                  <div style={styles.small}>You’ll follow the playlist you are submitting to.</div>
                </div>
              </label>

              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={consentFollowCurator}
                  onChange={(e) => setConsentFollowCurator(e.target.checked)}
                />
                <div>
                  <div style={styles.checkboxText}><b>Follow curator profile</b></div>
                  <div style={styles.small}>You’ll follow the curator on Spotify.</div>
                </div>
              </label>

              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={consentSaveTrack}
                  onChange={(e) => setConsentSaveTrack(e.target.checked)}
                />
                <div>
                  <div style={styles.checkboxText}><b>Save curator track</b></div>
                  <div style={styles.small}>A curator track will be saved to your library.</div>
                </div>
              </label>

              <label style={{ ...styles.checkboxRow, marginBottom: 0 }}>
                <input
                  type="checkbox"
                  checked={consentPresave}
                  onChange={(e) => setConsentPresave(e.target.checked)}
                />
                <div>
                  <div style={styles.checkboxText}><b>Pre-save upcoming release</b></div>
                  <div style={styles.small}>Only if an upcoming release is configured.</div>
                </div>
              </label>
            </div>

            <button onClick={startSpotify} style={styles.button}>
              Connect with Spotify &amp; Submit
            </button>
          </div>
        </div>

        <div style={styles.footer}>
          © {new Date().getFullYear()} EGM Playlists — All rights reserved.
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";

/* ================= BRAND ================= */
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
    maxWidth: 680,
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
  },
  title: {
    margin: 0,
    fontSize: 26,
    color: BRAND.text,
  },
  subtitle: {
    marginTop: 6,
    color: BRAND.muted,
    fontSize: 14,
  },
  divider: {
    height: 1,
    background: `linear-gradient(90deg, transparent, ${BRAND.border}, transparent)`,
    margin: "14px 0 18px",
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
    padding: "12px",
    borderRadius: 12,
    border: `1px solid ${BRAND.border}`,
    fontSize: 14,
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: 12,
    border: `1px solid ${BRAND.border}`,
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
  button: {
    marginTop: 18,
    width: "100%",
    padding: "14px",
    borderRadius: 14,
    border: "none",
    background: BRAND.accent,
    fontWeight: 900,
    cursor: "pointer",
  },
};

/* ================= PLAYLISTS ================= */
const PLAYLISTS = [
  { name: "EGM - Discovery Channel", id: "1e7cbv7cz2mKiaXPcexn9w" },
  { name: "EGM - On the Right Track", id: "5DOj4e0AvGKjgQXC8FA4Wd" },
  { name: "EGM - El Grande Christmas Times", id: "2tHFAcE6MOL1B93EaxZ71Q" },
  { name: "EGM - Purely Instrumental", id: "7hnKdxWaEU7Y4VJ7bA0TpM" },
  { name: "EGM - Dublin Nights", id: "7M6do4ctayzGohkcyvphpO" },
  { name: "EGM - K-POP Pastel Beats", id: "5ZDx7VPdItO672rXLBHEHZ" },
  { name: "EGM - Metal Hot List", id: "7DjSSrtfo754qGuXNitdZY" },
  { name: "EGM - Rasta Frequencies", id: "0Z1Hx8GbG4dbMx2RCsftOS" },
  { name: "EGM - UK Heat Index", id: "7FmbzAlxzm4lrgVXhgvI7w" },
  { name: "EGM - Rendez-Vous Dynamique", id: "767b0LvmGaced7DGNlcVOx" },
  { name: "EGM - Great Summer Vibes", id: "2QEHtuvZduBxGoamxzMRb5" },
  { name: "EGM - Barz & Beats", id: "34OcCkNae7oIO2lZAl1ql2" },
  { name: "EGM - EDM Hot List", id: "5fHj1XH3spgbu7HCpBdwNc" },
  { name: "EGM - Pop Hot List", id: "5PzyS8Bk815mu4TL25ie1L" },
  { name: "EGM - Blues Hot List", id: "2MC6NCT1ZX7qrUccbiflAA" },
  { name: "EGM - Best of Indie Club", id: "19KZUoBOKqGcny8wUljNya" },
  { name: "EGM - Viva la Música Española", id: "434kFORUjrcliaEePwx836" },
  { name: "EGM - Country Hot List", id: "59EdSE3ti8xkv69T9cJohQ" },
  { name: "EGM - Dance Mix", id: "4MDNLs4nj3TgpPeXbiKpRe" },
  { name: "EGM - Road Tracks", id: "25bGysNJ7BmU1VdUItgOf1" },
  { name: "EGM - Acoustic Hot List", id: "3ixpk3WZEojhoU2dP1Z0K5" },
  { name: "EGM - Rock Hot List", id: "1cY8086WzcTlcTIcfvDC7C" },
  { name: "EGM - Indie Hot List", id: "1red8yCovZUY1RdKvxqZDW" },
  { name: "EGM - RnB Hot List", id: "0S1B6CXPJL5relnJ8IbGqM" },
  { name: "EGM - Discover Pop Releases", id: "1dSS3zG20MP0IhDupSKBPp" },
  { name: "EGM - Rhythm of Love", id: "1QxQVfe6oE2xvQCskTIkrD" },
];

/* ================= COMPONENT ================= */
export default function Submit() {
  const [playlistId, setPlaylistId] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [trackUrl, setTrackUrl] = useState("");

  useMemo(() => {
    const selected = PLAYLISTS.find((p) => p.id === playlistId);
    if (selected) setPlaylistName(selected.name);
  }, [playlistId]);

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.cardInner}>
          <div style={styles.brandRow}>
            <div style={styles.logoBox}>EGM</div>
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
              <div style={styles.labelTitle}>Playlist naam</div>
              <input value={playlistName} disabled style={styles.input} />
            </label>
          </div>

          <label style={{ marginTop: 14, display: "block" }}>
            <div style={styles.labelTitle}>Spotify track link</div>
            <input
              value={trackUrl}
              onChange={(e) => setTrackUrl(e.target.value)}
              placeholder="https://open.spotify.com/track/..."
              style={styles.input}
            />
          </label>

          <button style={styles.button}>
            Connect with Spotify & Submit
          </button>
        </div>
      </div>
    </main>
  );
}

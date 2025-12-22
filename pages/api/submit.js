import { useEffect, useMemo, useState } from "react";

const BRAND = {
  bg: "#567A96", // background (blue/grey)
  accent: "#F5C400", // EGM yellow
  text: "#1F2A33",
  muted: "#5F6B76",
  border: "rgba(31,42,51,0.14)",
  card: "#FFFFFF",
};

const LOGO_URL = "https://www.egmplaylists.eu/images/EGM%20LOGO%20001.jpg";

// Local fallback so dropdown ALWAYS has items (even if config fetch fails)
const FALLBACK_PLAYLISTS = [
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

  // Decorative background layer: MUST NOT block clicks
  bgDecor: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    background:
      "radial-gradient(900px 500px at 20% 10%, rgba(245,196,0,0.22), transparent 55%), radial-gradient(700px 450px at 85% 20%, rgba(255,255,255,0.14), transparent 50%)",
  },

  card: {
    width: "100%",
    maxWidth: 820,
    background: BRAND.card,
    borderRadius: 22,
    boxShadow: "0 18px 55px rgba(0,0,0,0.22)",
    border: `1px solid ${BRAND.border}`,
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
  },
  cardInner: { padding: 22 },

  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 10,
  },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    background: "rgba(245,196,0,0.12)",
    border: `2px solid ${BRAND.accent}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flex: "0 0 auto",
  },
  logoImg: { width: "100%", height: "100%", objectFit: "cover" },

  title: { margin: 0, fontSize: 28, lineHeight: 1.1, color: BRAND.text },
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
    marginTop: 12,
  },

  label: { display: "block" },
  labelTitle: {
    fontWeight: 800,
    fontSize: 13,
    color: BRAND.text,
    marginBottom: 6,
  },

  // IMPORTANT: Make inputs always clickable + on top
  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: `1px solid ${BRAND.border}`,
    outline: "none",
    fontSize: 14,
    background: "#fff",
    position: "relative",
    zIndex: 10,
    pointerEvents: "auto",
  },

  select: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: `1px solid ${BRAND.border}`,
    outline: "none",
    fontSize: 14,
    background: "#fff",
    position: "relative",
    zIndex: 50, // higher than anything else
    pointerEvents: "auto",
    cursor: "pointer",
    WebkitAppearance: "menulist",
    appearance: "menulist",
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
    position: "relative",
    zIndex: 10,
    pointerEvents: "auto",
  },

  section: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    border: `1px solid ${BRAND.border}`,
    background: "rgba(86,122,150,0.06)",
    position: "relative",
    zIndex: 2,
  },
  sectionTitle: { fontWeight: 900, marginBottom: 10, color: BRAND.text },

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
    position: "relative",
    zIndex: 5,
  },
  buttonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },

  copyright: {
    marginTop: 14,
    color: "rgba(31,42,51,0.72)",
    fontSize: 12,
    lineHeight: 1.35,
    textAlign: "center",
  },

  bottomNoteOutsideCard: {
    marginTop: 10,
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
    textAlign: "center",
  },
};

export default function Submit() {
  const [playlists, setPlaylists] = useState(FALLBACK_PLAYLISTS);

  const [playlistId, setPlaylistId] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [trackUrl, setTrackUrl] = useState("");
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [pitch, setPitch] = useState("");

  // ✅ all 4 default checked
  const [consentFollowCurator, setConsentFollowCurator] = useState(true);
  const [consentFollowPlaylist, setConsentFollowPlaylist] = useState(true);
  const [consentSaveTrack, setConsentSaveTrack] = useState(true);
  const [consentPresave, setConsentPresave] = useState(true);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Prefill from query (?playlistId=...&playlistName=...)
  useMemo(() => {
    if (typeof window === "undefined") return;
    const pid = getQueryParam("playlistId");
    const pname = getQueryParam("playlistName");
    if (pid) setPlaylistId(pid);
    if (pname) setPlaylistName(pname);
  }, []);

  // Optional config fetch (won't break UI if it fails)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public-config", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;

        // Expecting: { playlists: [{name,id}], ... } (if you later add this)
        if (Array.isArray(data?.playlists) && data.playlists.length) {
          setPlaylists(data.playlists);
        }
      } catch (e) {
        // No banner — just silent fallback
        console.warn("public-config load failed (fallback in use)", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const canSubmit = playlistId && trackUrl && !busy;

  async function startSpotify() {
    setError("");
    if (!playlistId) return setError("Please select a playlist.");
    if (!trackUrl) return setError("Please paste a Spotify track link.");

    setBusy(true);
    try {
      // Persist a draft so the OAuth callback can finalize the submission
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
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("egm_submission_draft", JSON.stringify(draft));
      }

      // Kick off Spotify OAuth (existing endpoint in your project)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json().catch(() => ({}));
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setError("Could not start Spotify login. Please try again.");
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.bgDecor} />

      <div style={{ width: "100%", maxWidth: 820 }}>
        <main style={styles.card}>
          <div style={styles.cardInner}>
            <div style={styles.headerRow}>
              <div style={styles.logoWrap}>
                <img src={LOGO_URL} alt="EGM Playlists" style={styles.logoImg} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h1 style={styles.title}>Submit your track</h1>
                <p style={styles.subtitle}>
                  Real support for your music — reviewed by real curators.
                </p>
              </div>
            </div>

            <div style={styles.divider} />

            {error ? (
              <div
                style={{
                  padding: 12,
                  border: "1px solid rgba(220,53,69,0.35)",
                  background: "rgba(220,53,69,0.06)",
                  borderRadius: 12,
                  color: BRAND.text,
                  marginBottom: 12,
                }}
              >
                <strong style={{ display: "block", marginBottom: 4 }}>
                  Please check:
                </strong>
                <div style={{ fontSize: 13, opacity: 0.9 }}>{error}</div>
              </div>
            ) : null}

            <div style={styles.grid2}>
              <label style={styles.label}>
                <div style={styles.labelTitle}>Playlist</div>
                <select
                  value={playlistId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPlaylistId(val);
                    const selected = playlists.find((p) => p.id === val);
                    if (selected) setPlaylistName(selected.name);
                  }}
                  style={styles.select}
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
                  placeholder="Optional (auto-filled when you select a playlist)"
                  style={styles.input}
                />
              </label>
            </div>

            <label style={{ ...styles.label, marginTop: 12 }}>
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

            <label style={{ ...styles.label, marginTop: 12 }}>
              <div style={styles.labelTitle}>Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Optional"
                style={styles.input}
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

            <div style={styles.section}>
              <div style={styles.sectionTitle}>Spotify actions (gates)</div>

              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={consentFollowPlaylist}
                  onChange={(e) => setConsentFollowPlaylist(e.target.checked)}
                />
                <div>
                  <div style={styles.checkboxText}>
                    <strong>Follow selected playlist</strong>
                  </div>
                  <div style={styles.small}>
                    You’ll follow the playlist you are submitting to.
                  </div>
                </div>
              </label>

              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={consentFollowCurator}
                  onChange={(e) => setConsentFollowCurator(e.target.checked)}
                />
                <div>
                  <div style={styles.checkboxText}>
                    <strong>Follow curator profile</strong>
                  </div>
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
                  <div style={styles.checkboxText}>
                    <strong>Save curator track</strong>
                  </div>
                  <div style={styles.small}>
                    A curator track will be saved to your library.
                  </div>
                </div>
              </label>

              <label style={{ ...styles.checkboxRow, marginBottom: 0 }}>
                <input
                  type="checkbox"
                  checked={consentPresave}
                  onChange={(e) => setConsentPresave(e.target.checked)}
                />
                <div>
                  <div style={styles.checkboxText}>
                    <strong>Pre-save upcoming release</strong>
                  </div>
                  <div style={styles.small}>
                    Only if an upcoming release is configured.
                  </div>
                </div>
              </label>
            </div>

            <button
              onClick={startSpotify}
              style={{
                ...styles.button,
                ...(canSubmit ? null : styles.buttonDisabled),
              }}
              disabled={!canSubmit}
              title={!playlistId ? "Select a playlist first" : !trackUrl ? "Paste a track link" : ""}
            >
              {busy ? "Starting Spotify..." : "Connect with Spotify & Submit"}
            </button>

            <div style={styles.copyright}>
              By submitting, you confirm you have the rights to share this music. ©{" "}
              {new Date().getFullYear()} EGM Playlists. All rights reserved.
            </div>
          </div>
        </main>

        <div style={styles.bottomNoteOutsideCard}>
          Tip: Use a Spotify track link (not an album/artist link).
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";

const BRAND = {
  bg: "#567A96", // background (blue/grey)
  accent: "#F5C400", // EGM yellow
  text: "#1F2A33",
  muted: "#5F6B76",
  border: "rgba(31,42,51,0.12)",
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
  card: {
    width: "100%",
    maxWidth: 860,
    background: "#fff",
    borderRadius: 22,
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
  logoImgWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    border: `2px solid ${BRAND.accent}`,
    overflow: "hidden",
    background: "rgba(245,196,0,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 auto",
  },
  logoImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  title: {
    margin: 0,
    fontSize: 28,
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
  grid2Tight: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  label: {
    display: "block",
  },
  labelTitle: {
    fontWeight: 800,
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
    minHeight: 120,
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
    fontWeight: 900,
    marginBottom: 10,
    color: BRAND.text,
  },
  checkboxRow: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    marginBottom: 10,
  },
  checkboxText: {
    color: BRAND.text,
    fontSize: 14,
    lineHeight: 1.35,
  },
  small: {
    color: BRAND.muted,
    fontSize: 12,
    marginTop: 2,
  },
  warning: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(220, 60, 60, 0.35)",
    background: "rgba(220, 60, 60, 0.07)",
    color: BRAND.text,
    fontSize: 13,
    lineHeight: 1.35,
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
  footnote: {
    marginTop: 12,
    color: BRAND.muted,
    fontSize: 12,
    lineHeight: 1.4,
  },
  pageBottom: {
    marginTop: 12,
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    textAlign: "center",
  },
};

// ---- Fallback playlists (hardcoded) ----
// (We’ll still try to load /api/public-config, but this always works.)
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
  { name: "EGM - Discover pop releases here !", id: "1dSS3zG20MP0IhDupSKBPp" },
  { name: "EGM - RHYTHM of LOVE", id: "1QxQVfe6oE2xvQCskTIkrD" },
];

function getQueryParam(name) {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  return url.searchParams.get(name) || "";
}

function safeSortPlaylists(list) {
  return [...list].sort((a, b) => a.name.localeCompare(b.name));
}

export default function Submit() {
  const [playlistId, setPlaylistId] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [trackUrl, setTrackUrl] = useState("");
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [pitch, setPitch] = useState("");

  // ✅ All 4 checked by default
  const [consentFollowCurator, setConsentFollowCurator] = useState(true);
  const [consentFollowPlaylist, setConsentFollowPlaylist] = useState(true);
  const [consentSaveTrack, setConsentSaveTrack] = useState(true);
  const [consentPresave, setConsentPresave] = useState(true);

  // Config-loaded (optional)
  const [playlists, setPlaylists] = useState(() => safeSortPlaylists(FALLBACK_PLAYLISTS));
  const [configWarning, setConfigWarning] = useState("");

  // Prefill via URL params (optional)
  useEffect(() => {
    const pid = getQueryParam("playlistId");
    const pname = getQueryParam("playlistName");
    if (pid) setPlaylistId(pid);
    if (pname) setPlaylistName(pname);
  }, []);

  // Optional: load config from /api/public-config
  useEffect(() => {
    let cancelled = false;

    async function loadConfig() {
      try {
        const res = await fetch("/api/public-config", { cache: "no-store" });
        const ct = (res.headers.get("content-type") || "").toLowerCase();

        // Only accept JSON — this prevents the “Unexpected token '<' … is not valid JSON”
        if (!res.ok || !ct.includes("application/json")) return;

        const data = await res.json();
        if (cancelled) return;

        if (Array.isArray(data?.playlists) && data.playlists.length) {
          setPlaylists(safeSortPlaylists(data.playlists));
        }

        // Optional: allow config to set default gates
        if (data?.gates?.followPlaylist != null) setConsentFollowPlaylist(!!data.gates.followPlaylist);
        if (data?.gates?.followCurator != null) setConsentFollowCurator(!!data.gates.followCurator);
        if (data?.gates?.saveTrack != null) setConsentSaveTrack(!!data.gates.saveTrack);
        if (data?.gates?.presave != null) setConsentPresave(!!data.gates.presave);
      } catch (e) {
        // Don’t show scary warning; fallback continues to work.
        // If you DO want a warning, uncomment below:
        // if (!cancelled) setConfigWarning("Config could not be loaded. Using fallback playlists.");
      }
    }

    loadConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedPlaylist = useMemo(
    () => playlists.find((p) => p.id === playlistId) || null,
    [playlists, playlistId]
  );

  useEffect(() => {
    // Auto-fill playlist name when selecting from dropdown (only if empty or matches old selection behavior)
    if (selectedPlaylist && (!playlistName || playlistName === selectedPlaylist.name)) {
      setPlaylistName(selectedPlaylist.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistId]);

  async function startSpotify() {
    // Basic validation
    if (!playlistId) {
      alert("Please select a playlist.");
      return;
    }
    if (!trackUrl || !trackUrl.includes("open.spotify.com/track/")) {
      alert("Please paste a valid Spotify track link (open.spotify.com/track/...).");
      return;
    }

    // Persist draft for after OAuth
    const draft = {
      playlistId,
      playlistName: playlistName || selectedPlaylist?.name || "",
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

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("egm_submission_draft", JSON.stringify(draft));
      }
    } catch (_) {}

    // Kick off OAuth (existing backend route in your project)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // backend can read draft from localStorage after redirect; or ignore body
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      alert("Could not start Spotify login. Please check /api/auth/login.");
    } catch (e) {
      alert("Could not start Spotify login. Please check /api/auth/login.");
    }
  }

  return (
    <div style={styles.page}>
      <div style={{ width: "100%", maxWidth: styles.card.maxWidth }}>
        <main style={styles.card}>
          <div style={styles.cardInner}>
            <div style={styles.brandRow}>
              <div style={styles.logoImgWrap}>
                <img src={LOGO_URL} alt="EGM Playlists" style={styles.logoImg} />
              </div>

              <div style={{ minWidth: 0 }}>
                <h1 style={styles.title}>Submit your track</h1>
                <p style={styles.subtitle}>
                  Real support for your music — reviewed by real curators.
                </p>
              </div>
            </div>

            {configWarning ? <div style={styles.warning}>{configWarning}</div> : null}

            <div style={styles.divider} />

            {/* Playlist + Playlist name */}
            <div style={styles.grid2Tight}>
              <label style={styles.label}>
                <div style={styles.labelTitle}>Playlist</div>
                <select
                  value={playlistId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setPlaylistId(id);
                    const sel = playlists.find((p) => p.id === id);
                    if (sel) setPlaylistName(sel.name);
                  }}
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
                  placeholder="Optional (auto-filled when you select a playlist)"
                  style={styles.input}
                />
              </label>
            </div>

            {/* Track link */}
            <label style={{ ...styles.label, marginTop: 14 }}>
              <div style={styles.labelTitle}>Spotify track link</div>
              <input
                value={trackUrl}
                onChange={(e) => setTrackUrl(e.target.value)}
                placeholder="https://open.spotify.com/track/..."
                style={styles.input}
              />
            </label>

            {/* Artist + Instagram */}
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

            {/* Email */}
            <label style={{ ...styles.label, marginTop: 14 }}>
              <div style={styles.labelTitle}>Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Optional"
                style={styles.input}
              />
            </label>

            {/* Pitch */}
            <label style={{ ...styles.label, marginTop: 14 }}>
              <div style={styles.labelTitle}>Pitch</div>
              <textarea
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Optional — tell us a bit about the release."
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
                />
                <div>
                  <div style={{ ...styles.checkboxText, fontWeight: 800 }}>
                    Follow selected playlist
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
                  <div style={{ ...styles.checkboxText, fontWeight: 800 }}>
                    Follow curator profile
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
                  <div style={{ ...styles.checkboxText, fontWeight: 800 }}>
                    Save curator track
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
                  <div style={{ ...styles.checkboxText, fontWeight: 800 }}>
                    Pre-save upcoming release
                  </div>
                  <div style={styles.small}>
                    Only if an upcoming release is configured.
                  </div>
                </div>
              </label>

              {/* ✅ copyright / disclaimer UNDER the gates */}
              <div style={styles.footnote}>
                By continuing, you confirm that you have the rights/permission to submit this music.
                Spotify actions will only be executed after you approve Spotify login.
              </div>
            </div>

            <button onClick={startSpotify} style={styles.button}>
              Connect with Spotify &amp; Submit
            </button>
          </div>
        </main>

        <div style={styles.pageBottom}>© {new Date().getFullYear()} EGM Playlists</div>
      </div>
    </div>
  );
}

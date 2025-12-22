import { useEffect, useMemo, useState } from "react";

const LOGO_URL = "https://www.egmplaylists.eu/images/EGM%20LOGO%20001.jpg";

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
    maxWidth: 720,
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
  logoImg: {
    width: 56,
    height: 56,
    borderRadius: 14,
    border: `2px solid ${BRAND.accent}`,
    objectFit: "cover",
    background: "#fff",
  },
  title: { margin: 0, fontSize: 26, lineHeight: 1.1, color: BRAND.text },
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
  warning: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(220,0,0,0.25)",
    background: "rgba(220,0,0,0.06)",
    color: BRAND.text,
    fontSize: 13,
  },
  footer: {
    marginTop: 14,
    paddingTop: 12,
    borderTop: `1px solid ${BRAND.border}`,
    color: BRAND.muted,
    fontSize: 12,
    lineHeight: 1.45,
  },
};

function getQueryParam(name) {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  return url.searchParams.get(name) || "";
}

export default function Submit() {
  // Form fields
  const [playlistId, setPlaylistId] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [trackUrl, setTrackUrl] = useState("");
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [pitch, setPitch] = useState("");

  // Config from DB
  const [playlists, setPlaylists] = useState([]);
  const [gatesFromDb, setGatesFromDb] = useState(null);
  const [loadErr, setLoadErr] = useState("");

  // Gates (default TRUE for all 4)
  const [consentFollowCurator, setConsentFollowCurator] = useState(true);
  const [consentFollowPlaylist, setConsentFollowPlaylist] = useState(true);
  const [consentSaveTrack, setConsentSaveTrack] = useState(true);
  const [consentPresave, setConsentPresave] = useState(true);

  // Load config (playlists + gates) from Supabase via API
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadErr("");
      try {
        const res = await fetch("/api/public-config");
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load config");

        if (cancelled) return;

        setPlaylists(Array.isArray(json.playlists) ? json.playlists : []);
        setGatesFromDb(json.gates || null);

        // Apply DB defaults (still all true if DB says true)
        if (json.gates) {
          setConsentFollowPlaylist(!!json.gates.follow_playlist);
          setConsentFollowCurator(!!json.gates.follow_curator);
          setConsentSaveTrack(!!json.gates.save_track);
          setConsentPresave(!!json.gates.presave);
        }
      } catch (e) {
        if (!cancelled) setLoadErr(String(e?.message || e));
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Query params (optional deep link)
  useMemo(() => {
    if (typeof window === "undefined") return;
    const pid = getQueryParam("playlistId");
    const pname = getQueryParam("playlistName");
    if (pid) setPlaylistId(pid);
    if (pname) setPlaylistName(pname);
  }, []);

  // When user chooses playlist, also set playlistName automatically
  const selectedPlaylist = useMemo(() => {
    return playlists.find((p) => p.spotify_playlist_id === playlistId) || null;
  }, [playlists, playlistId]);

  useEffect(() => {
    if (selectedPlaylist?.name && !playlistName) {
      setPlaylistName(selectedPlaylist.name);
    }
  }, [selectedPlaylist, playlistName]);

  async function startSpotify() {
    // Basic validations
    if (!playlistId) {
      alert("Please select a playlist.");
      return;
    }
    if (!trackUrl || !trackUrl.includes("open.spotify.com/track")) {
      alert("Please paste a valid Spotify track link.");
      return;
    }

    // Persist draft for after OAuth (same pattern as before)
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
    localStorage.setItem("egm_submission_draft", JSON.stringify(draft));

    // Start OAuth
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const data = await res.json().catch(() => ({}));
    if (data?.url) {
      window.location.href = data.url;
    } else {
      alert("Could not start Spotify login.");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.cardInner}>
          <div style={styles.brandRow}>
            <img src={LOGO_URL} alt="EGM Playlists" style={styles.logoImg} />
            <div>
              <h1 style={styles.title}>Submit your track</h1>
              <p style={styles.subtitle}>
                Real support for your music — reviewed by real curators.
              </p>
            </div>
          </div>

          <div style={styles.divider} />

          {loadErr ? (
            <div style={styles.warning}>
              <b>Config load warning:</b> {loadErr}
              <div style={{ marginTop: 6 }}>
                The form still works, but playlists/gates may be missing until
                Supabase tables + API are set up.
              </div>
            </div>
          ) : null}

          <div style={styles.grid2}>
            <label style={styles.label}>
              <div style={styles.labelTitle}>Playlist</div>
              <select
                value={playlistId}
                onChange={(e) => {
                  const id = e.target.value;
                  setPlaylistId(id);
                  const picked = playlists.find((p) => p.spotify_playlist_id === id);
                  if (picked?.name) setPlaylistName(picked.name);
                }}
                style={styles.input}
              >
                <option value="">Select a playlist</option>
                {playlists.map((p) => (
                  <option key={p.spotify_playlist_id} value={p.spotify_playlist_id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {selectedPlaylist?.spotify_url ? (
                <div style={styles.small}>
                  Selected:{" "}
                  <a
                    href={selectedPlaylist.spotify_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    open playlist
                  </a>
                </div>
              ) : null}
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
                <div style={styles.checkboxText}>
                  <b>Follow selected playlist</b>
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
                  <b>Follow curator profile</b>
                </div>
                <div style={styles.small}>
                  You’ll follow the curator on Spotify.
                </div>
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
                  <b>Save curator track</b>
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
                  <b>Pre-save upcoming release</b>
                </div>
                <div style={styles.small}>
                  Only if an upcoming release is configured.
                </div>
              </div>
            </label>
          </div>

          <button onClick={startSpotify} style={styles.button}>
            Connect with Spotify &amp; Submit
          </button>

          <div style={styles.footer}>
            <div>
              After Spotify login, we will only perform the actions you enabled
              above.
            </div>
            <div style={{ marginTop: 8 }}>
              © {new Date().getFullYear()} EGM Playlists. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

/**
 * ✅ Fallback playlist list (name + id)
 * Als app_config niet kan laden, blijft je site 100% werken met deze lijst.
 */
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
  { name: "EGM – BEST OF INDIE CLUB", id: "19KZUoBOKqGcny8wUljNya" },
  { name: "EGM - Viva la Música Española", id: "434kFORUjrcliaEePwx836" },
  { name: "EGM - COUNTRY HOT LIST", id: "59EdSE3ti8xkv69T9cJohQ" },
  { name: "EGM - DANCE MIX", id: "4MDNLs4nj3TgpPeXbiKpRe" },
  { name: "EGM - ROAD TRACKS", id: "25bGysNJ7BmU1VdUItgOf1" },
  { name: "EGM - Acoustic HOT LIST", id: "3ixpk3WZEojhoU2dP1Z0K5" },
  { name: "EGM - ROCK HOT LIST", id: "1cY8086WzcTlcTIcfvDC7C" },
  { name: "EGM – INDIE HOT LIST", id: "1red8yCovZUY1RdKvxqZDW" },
  { name: "EGM - RnB HOT LIST", id: "0S1B6CXPJL5relnJ8IbGqM" },
  { name: "EGM - Discover pop releases here !", id: "1dSS3zG20MP0IhDupSKBPp" },
  { name: "EGM - RHYTHM of LOVE", id: "1QxQVfe6oE2xvQCskTIkrD" },
];

function getQueryParam(name) {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  return url.searchParams.get(name) || "";
}

function isLikelySpotifyTrackUrl(url) {
  if (!url) return false;
  return /open\.spotify\.com\/track\/[A-Za-z0-9]+/i.test(url.trim());
}

function normalizePlaylists(list) {
  if (!Array.isArray(list)) return [];
  const cleaned = list
    .map((p) => ({
      name: String(p?.name || "").trim(),
      id: String(p?.id || "").trim(),
    }))
    .filter((p) => p.name && p.id);

  // de-dupe by id
  const seen = new Set();
  const deduped = [];
  for (const p of cleaned) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    deduped.push(p);
  }
  return deduped;
}

export default function Submit() {
  const [playlistId, setPlaylistId] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [trackUrl, setTrackUrl] = useState("");
  const [artistName, setArtistName] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [pitch, setPitch] = useState("");

  // Gates (hidden in UI for now, but still sent)
  const [consentFollowPlaylist] = useState(true);
  const [consentFollowCurator] = useState(true);
  const [consentSaveTrack] = useState(true);
  const [consentPresave] = useState(true);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  // ✅ playlists now come from app_config (fallback to hardcoded list)
  const [playlists, setPlaylists] = useState(FALLBACK_PLAYLISTS);
  const [playlistsSource, setPlaylistsSource] = useState("fallback");

  // 1) Load playlists from app_config (client-side)
  useEffect(() => {
    let cancelled = false;

    async function loadPlaylists() {
      try {
        const supabaseUrl =
          process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        // If env vars are missing, just keep fallback (no crash)
        if (!supabaseUrl || !anonKey) return;

        const url =
          supabaseUrl.replace(/\/$/, "") +
          `/rest/v1/app_config?id=eq.main&select=config`;

        const r = await fetch(url, {
          headers: {
            apikey: anonKey,
            authorization: `Bearer ${anonKey}`,
          },
        });

        if (!r.ok) return;
        const j = await r.json().catch(() => null);

        const cfg = Array.isArray(j) && j[0]?.config ? j[0].config : null;
        const list = cfg?.playlists;

        const normalized = normalizePlaylists(list);
        if (!cancelled && normalized.length) {
          setPlaylists(normalized);
          setPlaylistsSource("app_config");
        }
      } catch {
        // keep fallback silently
      }
    }

    loadPlaylists();
    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Read playlistId/Name from query params once
  useEffect(() => {
    const pid = getQueryParam("playlistId");
    const pname = getQueryParam("playlistName");
    if (pid) setPlaylistId(pid);
    if (pname) setPlaylistName(pname);
  }, []);

  // 3) Auto-fill playlistName when playlistId changes (using current playlists list)
  useEffect(() => {
    const selected = playlists.find((p) => p.id === playlistId);
    if (selected) setPlaylistName(selected.name);
  }, [playlistId, playlists]);

  const selectedPlaylist = useMemo(
    () => playlists.find((p) => p.id === playlistId) || null,
    [playlistId, playlists]
  );

  async function handleSubmit() {
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
          gates: {
            followPlaylist: consentFollowPlaylist,
            followCurator: consentFollowCurator,
            saveTrack: consentSaveTrack,
            presave: consentPresave,
          },
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Submit failed (${res.status})`);
      }

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
              <div style={{ marginTop: 6, fontSize: 12, color: BRAND.muted }}>
                Playlists source: <b>{playlistsSource}</b>
              </div>
            </div>
          </div>

          <div style={styles.divider} />

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
            After Spotify login, only the configured actions will be executed.
          </div>
        </div>
      </main>
    </div>
  );
}

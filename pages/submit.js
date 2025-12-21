import { useMemo, useState } from "react";
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
    maxWidth: 560,
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
  logo: {
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
  label: {
    display: "block",
  },
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
    marginTop: 10,
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    textAlign: "center",
  },
};

const PLAYLISTS = [
  { name: "EGM - El Grande Discovery Channel", id: "1e7cbv7cz2mKiaXPcexn9w" },
  // voeg later meer toe...
];

// ✅ Playlists die mensen mogen kiezen (naam + playlistId)
// playlistId = het stuk uit je Spotify playlist link: /playlist/<DIT_STUK>
const PLAYLISTS = [
  { name: "EGM - El Grande Discovery Channel", id: "1e7cbv7cz2mKiaXPcexn9w" },
  // Voeg hier meer playlists toe:
  // { name: "El Grande Discovery Channel", id: "1e7cbv7cz2mKiaXPcexn9w" },
];

function getQueryParam(name) {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  return url.searchParams.get(name) || '';
}

export default function Submit() {
  const [playlistId, setPlaylistId] = useState('');
  const [playlistName, setPlaylistName] = useState('');
  const [trackUrl, setTrackUrl] = useState('');
  const [artistName, setArtistName] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [pitch, setPitch] = useState('');
  const [consentFollowCurator, setConsentFollowCurator] = useState(true);
  const [consentFollowPlaylist, setConsentFollowPlaylist] = useState(true);
  const [consentSaveTrack, setConsentSaveTrack] = useState(true);
  const [consentPresave, setConsentPresave] = useState(false);

  useMemo(() => {
    if (typeof window === 'undefined') return;
    const pid = getQueryParam('playlistId');
    const pname = getQueryParam('playlistName');
    if (pid) setPlaylistId(pid);
    if (pname) setPlaylistName(pname);
  }, []);

  async function startSpotify() {
   <label style={{display:"block"}}>
  <div style={{fontWeight: 600}}>Playlist</div>
   <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:18}}>

  <label style={{display:"block"}}>
    <div style={{fontWeight:600}}>Playlist</div>
    <select
      value={playlistId}
      onChange={(e) => {
        const selected = PLAYLISTS.find(p => p.id === e.target.value);
        setPlaylistId(e.target.value);
        if (selected) setPlaylistName(selected.name);
      }}
      style={{width:"100%", padding:10, border:"1px solid #ddd", borderRadius:10}}
    >
      <option value="">Selecteer een playlist</option>
      {PLAYLISTS.map(p => (
        <option key={p.id} value={p.id}>{p.name}</option>
      ))}
    </select>
  </label>

  <label style={{display:"block"}}>
    <div style={{fontWeight:600}}>Playlist naam (optioneel)</div>
    <input
      value={playlistName}
      onChange={e => setPlaylistName(e.target.value)}
      placeholder="bijv. UK Heat Index"
      style={{width:"100%", padding:10, border:"1px solid #ddd", borderRadius:10}}
    />
  </label>

</div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap: 12, marginTop: 18}}>
  <label style={{display:"block"}}>
    <div style={{fontWeight: 600}}>Playlist</div>

    <select
      value={playlistId}
      onChange={(e) => {
        const selected = PLAYLISTS.find((p) => p.id === e.target.value);
        setPlaylistId(e.target.value);
        if (selected) setPlaylistName(selected.name);
      }}
      style={{width:"100%", padding:10, border:"1px solid #ddd", borderRadius:10}}
    >
    </select>
  </label>

  <label style={{display:"block"}}>
    <div style={{fontWeight: 600}}>Playlist naam (optioneel)</div>
    <input
      value={playlistName}
      onChange={(e)=>setPlaylistName(e.target.value)}
      placeholder="bv. UK Heat Index"
      style={{width:"100%", padding:10, border:"1px solid #ddd", borderRadius:10}}
    />
  </label>
</div>

<label style={{display:"block"}}>
  <div style={{fontWeight: 600}}>Playlist</div>

  <select
    value={playlistId}
    onChange={(e) => {
      const selected = PLAYLISTS.find((p) => p.id === e.target.value);
      setPlaylistId(e.target.value);
      if (selected) setPlaylistName(selected.name);
    }}
    style={{width:"100%", padding:10, border:"1px solid #ddd", borderRadius:10}}
  >
    <option value="">Selecteer een playlist</option>
    {PLAYLISTS.map((p) => (
      <option key={p.id} value={p.id}>{p.name}</option>
    ))}
  </select>
</label>


      <label style={{display:"block", marginTop: 12}}>
        <div style={{fontWeight: 600}}>Email (optioneel)</div>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@email.com"
               style={{width:"100%", padding:10, border:"1px solid #ddd", borderRadius:10}}/>
      </label>

      <label style={{display:"block", marginTop: 12}}>
        <div style={{fontWeight: 600}}>Pitch (optioneel)</div>
        <textarea value={pitch} onChange={e=>setPitch(e.target.value)} rows={5}
                  style={{width:"100%", padding:10, border:"1px solid #ddd", borderRadius:10}}/>
      </label>

      <div style={{marginTop: 18, padding: 14, border:"1px solid #eee", borderRadius: 12}}>
        <div style={{fontWeight: 700, marginBottom: 8}}>Spotify actions (gates)</div>

        <label style={{display:"flex", gap: 10, alignItems:"flex-start", marginBottom: 8}}>
          <input type="checkbox" checked={consentFollowPlaylist} onChange={e=>setConsentFollowPlaylist(e.target.checked)} />
          <div>
            <div style={{fontWeight: 600}}>Follow gekozen playlist</div>
            <div style={{opacity: .75, fontSize: 13}}>Je volgt de playlist waarvoor je indient.</div>
          </div>
        </label>

        <label style={{display:"flex", gap: 10, alignItems:"flex-start", marginBottom: 8}}>
          <input type="checkbox" checked={consentFollowCurator} onChange={e=>setConsentFollowCurator(e.target.checked)} />
          <div>
            <div style={{fontWeight: 600}}>Follow curator profiel</div>
            <div style={{opacity: .75, fontSize: 13}}>Je volgt de curator op Spotify.</div>
          </div>
        </label>

        <label style={{display:"flex", gap: 10, alignItems:"flex-start", marginBottom: 8}}>
          <input type="checkbox" checked={consentSaveTrack} onChange={e=>setConsentSaveTrack(e.target.checked)} />
          <div>
            <div style={{fontWeight: 600}}>Save curator track</div>
            <div style={{opacity: .75, fontSize: 13}}>Je slaat een curator track op in je library.</div>
          </div>
        </label>

        <label style={{display:"flex", gap: 10, alignItems:"flex-start"}}>
          <input type="checkbox" checked={consentPresave} onChange={e=>setConsentPresave(e.target.checked)} />
          <div>
            <div style={{fontWeight: 600}}>Pre-save upcoming release</div>
            <div style={{opacity: .75, fontSize: 13}}>Alleen als er een upcoming release is ingesteld.</div>
          </div>
        </label>
      </div>

      <button onClick={startSpotify} style={{marginTop: 18, padding:"12px 16px", borderRadius: 12, border:"1px solid #111", background:"#111", color:"#fff", fontWeight:700}}>
        Connect with Spotify & Submit
      </button>

      <p style={{marginTop: 12, opacity: .7, fontSize: 13}}>
        Na Spotify login voeren we alleen de acties uit die je aangevinkt hebt.
      </p>
    </main>
  );
}

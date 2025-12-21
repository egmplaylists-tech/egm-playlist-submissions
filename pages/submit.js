import { useMemo, useState } from "react";
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

    const res = await fetch('/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({}) });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
    else alert('Kon Spotify login niet starten.');
  }

  return (
    <main style={{maxWidth: 860, margin: "40px auto", padding: 16, fontFamily: "system-ui"}}>
      <h1 style={{fontSize: 30}}>Submit your track</h1>
      <p style={{opacity: 0.8}}>Vul in en verbind met Spotify om te submitten.</p>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap: 12, marginTop: 18}}>
        <label style={{display:"block"}}>
<label style={{display:"block"}}>
  <div style={{fontWeight: 600}}>Playlist</div>

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
          <div style={{fontWeight: 600}}>Playlist naam (optioneel)</div>
          <input value={playlistName} onChange={e=>setPlaylistName(e.target.value)} placeholder="bijv. UK Heat Index"
                 style={{width:"100%", padding:10, border:"1px solid #ddd", borderRadius:10}}/>
        </label>
      </div>

      <label style={{display:"block", marginTop: 12}}>
        <div style={{fontWeight: 600}}>Track link (Spotify)</div>
        <input value={trackUrl} onChange={e=>setTrackUrl(e.target.value)} placeholder="https://open.spotify.com/track/..."
               style={{width:"100%", padding:10, border:"1px solid #ddd", borderRadius:10}}/>
      </label>

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
      <option value="">Selecteer een playlist</option>
      {PLAYLISTS.map((p) => (
        <option key={p.id} value={p.id}>{p.name}</option>
      ))}
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

        </label>
        <label style={{display:"block"}}>
          <div style={{fontWeight: 600}}>Instagram (optioneel)</div>
          <input value={instagram} onChange={e=>setInstagram(e.target.value)} placeholder="@..."
                 style={{width:"100%", padding:10, border:"1px solid #ddd", borderRadius:10}}/>
        </label>
      </div>

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

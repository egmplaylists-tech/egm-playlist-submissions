import { useEffect, useState } from "react";

export default function Admin() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    const res = await fetch("/api/admin/list");
    const data = await res.json();
    if (!res.ok) setError(data?.error || "Error");
    else setItems(data.items || []);
  }

  useEffect(() => { load(); }, []);

  return (
    <main style={{maxWidth: 1100, margin: "40px auto", padding: 16, fontFamily: "system-ui"}}>
      <h1 style={{fontSize: 30}}>Submissions Inbox</h1>
      <p style={{opacity:.75}}>Let op: deze admin page heeft nog geen login. Dat voegen we als volgende stap toe.</p>

      {error && <div style={{padding:12, border:"1px solid #f99", borderRadius: 10, marginTop: 12}}>{error}</div>}

      <div style={{marginTop: 16, overflowX:"auto"}}>
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr>
              {["created_at","playlist_name","playlist_id","submitted_track_url","artist_name","email","instagram","status"].map(h => (
                <th key={h} style={{textAlign:"left", padding:10, borderBottom:"1px solid #eee", fontSize: 12, opacity:.8}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td style={{padding:10, borderBottom:"1px solid #f3f3f3", fontSize: 12}}>{new Date(it.created_at).toLocaleString()}</td>
                <td style={{padding:10, borderBottom:"1px solid #f3f3f3"}}>{it.playlist_name || ""}</td>
                <td style={{padding:10, borderBottom:"1px solid #f3f3f3", fontSize: 12}}>{it.playlist_id}</td>
                <td style={{padding:10, borderBottom:"1px solid #f3f3f3"}}><a href={it.submitted_track_url} target="_blank" rel="noreferrer">open</a></td>
                <td style={{padding:10, borderBottom:"1px solid #f3f3f3"}}>{it.artist_name || ""}</td>
                <td style={{padding:10, borderBottom:"1px solid #f3f3f3"}}>{it.email || ""}</td>
                <td style={{padding:10, borderBottom:"1px solid #f3f3f3"}}>{it.instagram || ""}</td>
                <td style={{padding:10, borderBottom:"1px solid #f3f3f3"}}>{it.status}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={8} style={{padding:14, opacity:.7}}>Nog geen submissions.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

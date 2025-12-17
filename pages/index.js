import Link from "next/link";

export default function Home() {
  return (
    <main style={{maxWidth: 860, margin: "40px auto", padding: 16, fontFamily: "system-ui"}}>
      <h1 style={{fontSize: 36, marginBottom: 8}}>EGM Playlist Submissions</h1>
      <p style={{lineHeight: 1.5}}>
        Dit is de submission app. Je kunt deze link gebruiken vanuit je one.com website.
      </p>

      <div style={{display:"flex", gap: 12, marginTop: 20, flexWrap:"wrap"}}>
        <Link href="/submit" style={{padding:"10px 14px", border:"1px solid #ddd", borderRadius: 10}}>Open submit page</Link>
        <Link href="/admin" style={{padding:"10px 14px", border:"1px solid #ddd", borderRadius: 10}}>Admin inbox</Link>
      </div>

      <hr style={{margin:"28px 0"}}/>

      <h2 style={{fontSize: 18}}>Wat dit al doet</h2>
      <ul style={{lineHeight: 1.6}}>
        <li>Formulier: track link + pitch + contact</li>
        <li>Spotify login (OAuth) + gates uitvoeren</li>
        <li>Submission opslaan in Supabase</li>
      </ul>

      <p style={{marginTop: 18, opacity: 0.8}}>
        Tip: je kunt straks direct linken naar <code>/submit?playlistId=...</code> vanaf je bestaande playlist cards.
      </p>
    </main>
  );
}

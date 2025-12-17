import Link from "next/link";

export default function Thanks() {
  return (
    <main style={{maxWidth: 860, margin: "40px auto", padding: 16, fontFamily: "system-ui"}}>
      <h1 style={{fontSize: 30}}>Thanks! ✅</h1>
      <p>Je submission is binnengekomen.</p>
      <div style={{marginTop: 18}}>
        <Link href="/submit" style={{padding:"10px 14px", border:"1px solid #ddd", borderRadius:10}}>Submit another</Link>
      </div>
    </main>
  );
}

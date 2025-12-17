import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

function parseCookies(cookieHeader = "") {
  const out = {};
  cookieHeader.split(";").forEach((part) => {
    const [k, ...v] = part.trim().split("=");
    if (!k) return;
    out[k] = decodeURIComponent(v.join("="));
  });
  return out;
}

export default async function handler(req, res) {
  // This endpoint is hit after spotify callback redirect.
  // It returns a tiny HTML page that reads localStorage draft, POSTs to /api/submit, then redirects to /thanks.
  const cookies = parseCookies(req.headers.cookie || "");
  const spotifyUserId = cookies.spotify_user_id || "";
  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"/></head>
<body style="font-family:system-ui;padding:24px;max-width:680px;margin:40px auto;">
  <h1 style="margin:0 0 8px 0;">Submitting…</h1>
  <p style="opacity:.75">Even geduld, we verwerken je submission.</p>
  <script>
    (async function(){
      try{
        const draftRaw = localStorage.getItem('egm_submission_draft');
        if(!draftRaw) throw new Error('Geen draft gevonden. Ga terug naar /submit.');
        const draft = JSON.parse(draftRaw);
        const resp = await fetch('/api/submit', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(draft)});
        const data = await resp.json();
        if(!resp.ok) throw new Error(data && data.error ? data.error : 'Submit failed');
        localStorage.removeItem('egm_submission_draft');
        window.location.href = '/thanks';
      }catch(e){
        document.body.innerHTML = '<h1>Er ging iets mis</h1><p style="opacity:.75">' + (e.message||e) + '</p><p><a href="/submit">Terug naar submit</a></p>';
      }
    })();
  </script>
</body>
</html>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}

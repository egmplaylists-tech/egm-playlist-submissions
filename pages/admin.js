import { useEffect, useMemo, useState } from "react";

const BRAND = {
  bg: "#E9F0F6",
  card: "#FFFFFF",
  text: "#1F2A33",
  muted: "#5F6B76",
  border: "rgba(31,42,51,0.12)",
  accent: "#F5C400",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: BRAND.bg,
    padding: 24,
    fontFamily:
      'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
    color: BRAND.text,
  },
  headerRow: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 14,
  },
  h1: { margin: 0, fontSize: 34, letterSpacing: -0.5 },
  sub: { marginTop: 6, color: BRAND.muted },
  rightTools: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  input: {
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${BRAND.border}`,
    outline: "none",
    fontSize: 14,
    background: "#fff",
  },
  btn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: `1px solid ${BRAND.border}`,
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  btnAccent: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    background: BRAND.accent,
    cursor: "pointer",
    fontWeight: 900,
  },
  alert: {
    background: "#FFECEC",
    border: "1px solid #FFB3B3",
    padding: 12,
    borderRadius: 12,
    color: "#8A1F1F",
    marginBottom: 16,
  },
  card: {
    background: BRAND.card,
    borderRadius: 18,
    border: `1px solid ${BRAND.border}`,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  cardHeader: {
    padding: 16,
    borderBottom: `1px solid ${BRAND.border}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  cardTitle: { fontSize: 18, fontWeight: 900 },
  cardBody: { padding: 16 },
  small: { fontSize: 12, color: BRAND.muted },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: 10,
    borderBottom: `1px solid ${BRAND.border}`,
    fontSize: 12,
    color: BRAND.muted,
    whiteSpace: "nowrap",
  },
  td: {
    padding: 10,
    borderBottom: `1px solid ${BRAND.border}`,
    verticalAlign: "top",
    fontSize: 13,
  },
  pill: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    border: `1px solid ${BRAND.border}`,
    background: "#fff",
    fontSize: 12,
    color: BRAND.text,
  },
  actions: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
};

function getLS(key, fallback = "") {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) || fallback;
}
function setLS(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
}

function encodeMailto(text) {
  // mailto: needs URL encoding, but keep line breaks
  return encodeURIComponent(text).replace(/%0A/g, "%0D%0A");
}

function buildApprovedEmailBody({ artistName }) {
  return `Hi ${artistName || "there"},

Thank you for submitting this amazing track! 🎶  
We’re happy to let you know that your song has been approved and is now live on Spotify and YouTube — a great fit for the playlist.

We truly appreciate the trust you place in EGM Playlists, and we’re excited to support your music.

💖 Show some love
Sharing really helps independent artists grow.
Feel free to share the playlist with friends, family, and even your local gym — the more people listening, the more your music gets streamed.

✨ Free promotion opportunities
You’re welcome to promote your music for free in our Facebook group:
https://www.facebook.com/groups/elgrandemusiceu

🙌 Want to say thanks?
Support us by following and connecting on our social platforms — let’s grow together!

YouTube: https://www.youtube.com/@juanelgrande/playlists
Instagram: https://www.instagram.com/elgrandemusic_eu/
Facebook: https://www.facebook.com/JuanElGrandeFans
Bluesky: https://bsky.app/profile/juanelgrandemusic.bsky.social
SoundCloud: https://soundcloud.com/juanelgrandemusic

🎧 Discover more playlists
https://www.egmplaylists.eu

Best regards,
EGM Playlists
Curated by real people — powered by passion`;
}

function buildRejectedEmailBody({ artistName }) {
  return `Hi ${artistName || "there"},

Thank you for submitting your track to EGM Playlists and for giving us the opportunity to listen to your release.

After careful consideration, we’ve decided not to include this track in our playlists at this moment. This decision is never personal — our selections depend on many factors such as playlist direction, current mood, timing, and overall flow.

🎧 Please note
- Every submission is manually reviewed
- Not being selected now does not affect future submissions
- You are always welcome to submit new or upcoming releases

✨ Free promotion opportunities
You’re welcome to promote your music for free in our Facebook group:
https://www.facebook.com/groups/elgrandemusiceu

🙌 Stay connected
YouTube: https://www.youtube.com/@juanelgrande/playlists
Instagram: https://www.instagram.com/elgrandemusic_eu/
Facebook: https://www.facebook.com/JuanElGrandeFans
Bluesky: https://bsky.app/profile/juanelgrandemusic.bsky.social
SoundCloud: https://soundcloud.com/juanelgrandemusic

🎧 Discover more playlists
https://www.egmplaylists.eu

Kind regards,
EGM Playlists
Curated by real people — powered by passion`;
}

function makeMailto({ to, subject, body }) {
  const s = encodeURIComponent(subject || "");
  const b = encodeMailto(body || "");
  return `mailto:${encodeURIComponent(to || "")}?subject=${s}&body=${b}`;
}

export default function Admin() {
  const [adminKey, setAdminKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAdminKey(getLS("egm_admin_key", ""));
  }, []);

  async function loadSubmissions() {
    setError("");
    setLoading(true);
    try {
      const r = await fetch("/api/admin/list", {
        headers: { "x-admin-key": adminKey },
      });
      const j = await r.json();

      // Support multiple shapes:
      // { ok:true, items:[...] } or { data:[...] } or [...]
      const data = Array.isArray(j?.items)
        ? j.items
        : Array.isArray(j?.data)
        ? j.data
        : Array.isArray(j)
        ? j
        : [];

      if (j?.ok === false && j?.error) throw new Error(j.error);
      if (!Array.isArray(data)) throw new Error("Invalid response from /api/admin/list");

      setRows(data);
    } catch (e) {
      setError(String(e?.message || e));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function setStatus(id, status) {
    setError("");
    try {
      const r = await fetch("/api/admin/set-status", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ id, status }),
      });
      const j = await r.json();
      if (j?.ok === false && j?.error) throw new Error(j.error);
      await loadSubmissions();
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  const filtered = useMemo(() => {
    if (statusFilter === "all") return rows;
    return rows.filter(
      (r) => String(r.status || "").toLowerCase() === statusFilter
    );
  }, [rows, statusFilter]);

  return (
    <main style={styles.page}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.h1}>Submissions Inbox</h1>
          <div style={styles.sub}>
            Review submissions, approve/reject, and email artists manually (free).
          </div>
        </div>

        <div style={styles.rightTools}>
          <input
            style={styles.input}
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="ADMIN_KEY"
          />
          <button
            style={styles.btnAccent}
            onClick={() => {
              setLS("egm_admin_key", adminKey);
              loadSubmissions();
            }}
          >
            Save key
          </button>

          <select
            style={styles.input}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">pending</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
          </select>

          <button style={styles.btn} onClick={loadSubmissions}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {error && (
        <div style={styles.alert}>
          <b>Error:</b> {error}
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <div style={styles.cardTitle}>Submissions</div>
            <div style={styles.small}>
              Showing {filtered.length} of {rows.length}
            </div>
          </div>
          <div style={styles.small}>
            Tip: Use “Email artist” buttons to send messages manually (no Resend needed).
          </div>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {[
                  "created_at",
                  "playlist_name",
                  "submitted_track_url",
                  "artist_name",
                  "email",
                  "instagram",
                  "status",
                  "actions",
                ].map((h) => (
                  <th key={h} style={styles.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td style={styles.td} colSpan={8}>
                    No submissions found for this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const created = r.created_at
                    ? new Date(r.created_at).toLocaleString()
                    : "-";

                  const artist = r.artist_name || "";
                  const email = r.email || "";
                  const trackUrl = r.submitted_track_url || "";

                  const approvedSubject = "Your track is approved and now live 🎶";
                  const rejectedSubject = "Thank you for your submission";

                  const approvedBody = buildApprovedEmailBody({ artistName: artist });
                  const rejectedBody = buildRejectedEmailBody({ artistName: artist });

                  const mailtoApproved = email
                    ? makeMailto({
                        to: email,
                        subject: approvedSubject,
                        body: approvedBody,
                      })
                    : "";

                  const mailtoRejected = email
                    ? makeMailto({
                        to: email,
                        subject: rejectedSubject,
                        body: rejectedBody,
                      })
                    : "";

                  return (
                    <tr key={r.id}>
                      <td style={styles.td}>
                        <span style={styles.pill}>{created}</span>
                      </td>
                      <td style={styles.td}>{r.playlist_name || r.playlist_id || "-"}</td>
                      <td style={styles.td}>
                        {trackUrl ? (
                          <a href={trackUrl} target="_blank" rel="noreferrer">
                            Open
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td style={styles.td}>{artist || "-"}</td>
                      <td style={styles.td}>{email || "-"}</td>
                      <td style={styles.td}>{r.instagram || "-"}</td>
                      <td style={styles.td}>{r.status || "pending"}</td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button
                            style={styles.btnAccent}
                            onClick={() => setStatus(r.id, "approved")}
                          >
                            Approve
                          </button>

                          <button
                            style={styles.btn}
                            onClick={() => setStatus(r.id, "rejected")}
                          >
                            Reject
                          </button>

                          <a
                            href={mailtoApproved || "#"}
                            onClick={(e) => {
                              if (!mailtoApproved) {
                                e.preventDefault();
                                alert("No email found for this submission.");
                              }
                            }}
                            style={{
                              ...styles.btn,
                              textDecoration: "none",
                              display: "inline-block",
                            }}
                          >
                            Email artist (Approved)
                          </a>

                          <a
                            href={mailtoRejected || "#"}
                            onClick={(e) => {
                              if (!mailtoRejected) {
                                e.preventDefault();
                                alert("No email found for this submission.");
                              }
                            }}
                            style={{
                              ...styles.btn,
                              textDecoration: "none",
                              display: "inline-block",
                            }}
                          >
                            Email artist (Rejected)
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div style={{ padding: 14, ...styles.small }}>
          Security note: this page uses an admin key stored in your browser (localStorage) and checked server-side.
        </div>
      </div>
    </main>
  );
}

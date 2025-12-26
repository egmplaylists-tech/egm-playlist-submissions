import { useEffect, useMemo, useState } from "react";

const BRAND = {
  // Zachter dan hard wit: licht blauw-grijs (oogvriendelijk)
  bg: "#F4F7FB",
  card: "#FFFFFF",
  text: "#1F2A33",
  muted: "#5F6B76",
  border: "rgba(31,42,51,0.12)",
  accent: "#F5C400",
  green: "#16A34A",
  red: "#E11D48",
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
  // Compacte acties
  actions: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    border: `1px solid ${BRAND.border}`,
    background: "#fff",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    userSelect: "none",
  },
  iconBtnGreen: {
    border: `1px solid rgba(22,163,74,0.25)`,
  },
  iconBtnRed: {
    border: `1px solid rgba(225,29,72,0.25)`,
  },
  icon: { width: 18, height: 18, display: "block" },
  tipBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    border: `1px solid ${BRAND.border}`,
    background: "rgba(255,255,255,0.7)",
  },
};

// localStorage helpers
function getLS(key, fallback = "") {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) || fallback;
}
function setLS(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
}

// mailto helpers
function encodeMailto(text) {
  return encodeURIComponent(text || "").replace(/%0A/g, "%0D%0A");
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
Bluesky: https://bsky.app/profile/juanelgrandemusiceu.bsky.social
SoundCloud: https://soundcloud.com/juanelgrandemusic

🎧 Discover more playlists
https://www.egmplaylists.eu

Kind regards,
EGM Playlists
Curated by real people — powered by passion`;
}

// PROBEER "From" te sturen via mailto params (werkt afhankelijk van mailclient)
// De échte fix blijft: Outlook standaardaccount = submit@...
function makeMailto({ to, subject, body, preferredFrom }) {
  const s = encodeURIComponent(subject || "");
  const b = encodeMailto(body || "");
  const base = `mailto:${encodeURIComponent(to || "")}?subject=${s}&body=${b}`;

  // Sommige clients respecteren extra params zoals "from" of "reply-to" niet,
  // maar het kan helpen in sommige setups.
  const extra = [];
  if (preferredFrom) {
    extra.push(`from=${encodeURIComponent(preferredFrom)}`);
    extra.push(`reply-to=${encodeURIComponent(preferredFrom)}`);
  }

  return extra.length ? `${base}&${extra.join("&")}` : base;
}

// Minimal inline SVG icons (geen dependencies nodig)
function ThumbsUpIcon({ color = BRAND.green }) {
  return (
    <svg viewBox="0 0 24 24" style={styles.icon} aria-hidden="true">
      <path
        fill={color}
        d="M2 21h4V9H2v12Zm20-11c0-1.1-.9-2-2-2h-6.3l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13 1 7.59 6.41C7.22 6.78 7 7.3 7 7.83V19c0 1.1.9 2 2 2h7c.82 0 1.54-.5 1.84-1.22l2.02-4.71c.09-.23.14-.47.14-.72v-4.35Z"
      />
    </svg>
  );
}
function ThumbsDownIcon({ color = BRAND.red }) {
  return (
    <svg viewBox="0 0 24 24" style={styles.icon} aria-hidden="true">
      <path
        fill={color}
        d="M22 3h-4v12h4V3ZM2 14c0 1.1.9 2 2 2h6.3l-.95 4.57-.03.32c0 .41.17.79.44 1.06L11 23l5.41-5.41c.37-.37.59-.89.59-1.42V5c0-1.1-.9-2-2-2H8c-.82 0-1.54.5-1.84 1.22L4.14 8.93c-.09.23-.14.47-.14.72V14Z"
      />
    </svg>
  );
}
function MailIcon({ color = BRAND.green }) {
  return (
    <svg viewBox="0 0 24 24" style={styles.icon} aria-hidden="true">
      <path
        fill={color}
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"
      />
    </svg>
  );
}

export default function Admin() {
  const [adminKey, setAdminKey] = useState("");
  // ✅ Default startpagina = PENDING
  const [statusFilter, setStatusFilter] = useState("pending");
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const preferredFrom = "submit@egmplaylists.eu";

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

      const data = Array.isArray(j?.items)
        ? j.items
        : Array.isArray(j?.data)
        ? j.data
        : Array.isArray(j)
        ? j
        : [];

      if (j?.ok === false && j?.error) throw new Error(j.error);
      if (!Array.isArray(data))
        throw new Error("Invalid response from /api/admin/list");

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
      (r) => String(r.status || "pending").toLowerCase() === statusFilter
    );
  }, [rows, statusFilter]);

  function IconButton({ title, onClick, variant = "neutral", children }) {
    const base = styles.iconBtn;
    const variantStyle =
      variant === "green"
        ? styles.iconBtnGreen
        : variant === "red"
        ? styles.iconBtnRed
        : null;

    return (
      <button
        type="button"
        title={title}
        aria-label={title}
        onClick={onClick}
        style={{ ...base, ...(variantStyle || {}) }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0px)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {children}
      </button>
    );
  }

  function IconLink({ title, href, variant = "neutral", onGuardClick, children }) {
    const base = styles.iconBtn;
    const variantStyle =
      variant === "green"
        ? styles.iconBtnGreen
        : variant === "red"
        ? styles.iconBtnRed
        : null;

    return (
      <a
        title={title}
        aria-label={title}
        href={href || "#"}
        onClick={onGuardClick}
        style={{ ...base, ...(variantStyle || {}) }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0px)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {children}
      </a>
    );
  }

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

          {/* ✅ Default = pending */}
          <select
            style={styles.input}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            title="Filter"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All</option>
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
            Tip: Email buttons open your mail client. Set Outlook default account to{" "}
            <b>{preferredFrom}</b> to avoid wrong sender.
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
                        preferredFrom,
                      })
                    : "";

                  const mailtoRejected = email
                    ? makeMailto({
                        to: email,
                        subject: rejectedSubject,
                        body: rejectedBody,
                        preferredFrom,
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

                      {/* ✅ Compacte icon actions */}
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          {/* Approve */}
                          <IconButton
                            title="Approve"
                            variant="green"
                            onClick={() => setStatus(r.id, "approved")}
                          >
                            <ThumbsUpIcon />
                          </IconButton>

                          {/* Reject */}
                          <IconButton
                            title="Reject"
                            variant="red"
                            onClick={() => setStatus(r.id, "rejected")}
                          >
                            <ThumbsDownIcon />
                          </IconButton>

                          {/* Email Approved */}
                          <IconLink
                            title="Email (Approved)"
                            variant="green"
                            href={mailtoApproved || "#"}
                            onGuardClick={(e) => {
                              if (!mailtoApproved) {
                                e.preventDefault();
                                alert("No email found for this submission.");
                              }
                            }}
                          >
                            <MailIcon color={BRAND.green} />
                          </IconLink>

                          {/* Email Rejected */}
                          <IconLink
                            title="Email (Rejected)"
                            variant="red"
                            href={mailtoRejected || "#"}
                            onGuardClick={(e) => {
                              if (!mailtoRejected) {
                                e.preventDefault();
                                alert("No email found for this submission.");
                              }
                            }}
                          >
                            <MailIcon color={BRAND.red} />
                          </IconLink>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div style={styles.tipBox}>
          <div style={styles.small}>
            <b>Important:</b> This page uses an admin key stored in your browser (localStorage) and checked server-side.
            <br />
            <b>Mail tip:</b> To always reply from <b>{preferredFrom}</b>, set that account as default in Outlook.
            Some mail clients ignore the “from/reply-to” mailto parameters.
          </div>
        </div>
      </div>
    </main>
  );
}

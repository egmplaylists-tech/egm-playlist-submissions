import { useEffect, useMemo, useState } from "react";

const BRAND = {
  pageBg: "#E9EEF3",         // zacht blauw/grijs
  cardBg: "#FFFFFF",
  cardBorder: "rgba(31,42,51,0.10)",
  text: "#1F2A33",
  muted: "#5F6B76",
  accent: "#F5C400",
  danger: "#E24A4A",
  ok: "#1E9E67",
  warn: "#D98B00",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: BRAND.pageBg,
    padding: 24,
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
    color: BRAND.text,
  },
  headerRow: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },
  title: { margin: 0, fontSize: 26, fontWeight: 900 },
  subtitle: { margin: "6px 0 0 0", color: BRAND.muted, fontSize: 13 },
  controls: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  input: {
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${BRAND.cardBorder}`,
    outline: "none",
    fontSize: 14,
    background: "#fff",
  },
  button: {
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${BRAND.cardBorder}`,
    background: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },
  primary: {
    background: BRAND.accent,
    border: "none",
  },
  wrap: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  card: {
    background: BRAND.cardBg,
    borderRadius: 16,
    border: `1px solid ${BRAND.cardBorder}`,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  cardHead: {
    padding: 14,
    borderBottom: `1px solid ${BRAND.cardBorder}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    background: "rgba(86,122,150,0.05)",
  },
  small: { color: BRAND.muted, fontSize: 12 },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: 12,
    borderBottom: `1px solid ${BRAND.cardBorder}`,
    fontSize: 12,
    color: BRAND.muted,
    whiteSpace: "nowrap",
  },
  td: {
    padding: 12,
    borderBottom: `1px solid ${BRAND.cardBorder}`,
    verticalAlign: "top",
    fontSize: 13,
  },
  rowActions: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    border: `1px solid ${BRAND.cardBorder}`,
    background: "#fff",
    whiteSpace: "nowrap",
  },
  link: { color: BRAND.text, textDecoration: "underline" },
  toast: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${BRAND.cardBorder}`,
    background: "#fff",
    color: BRAND.text,
  },
  error: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(226,74,74,0.35)",
    background: "rgba(226,74,74,0.08)",
    color: BRAND.text,
  },
};

function StatusBadge({ status }) {
  const s = (status || "pending").toLowerCase();
  let dot = BRAND.warn;
  let label = "Pending";
  if (s === "approved") { dot = BRAND.ok; label = "Approved"; }
  if (s === "rejected") { dot = BRAND.danger; label = "Rejected"; }

  return (
    <span style={styles.badge} title={`Status: ${label}`}>
      <span style={{ width: 8, height: 8, borderRadius: 99, background: dot, display: "inline-block" }} />
      {label}
    </span>
  );
}

export default function Admin() {
  const [adminKey, setAdminKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("all"); // all | pending | approved | rejected

  useEffect(() => {
    const saved = window.localStorage.getItem("egm_admin_key") || "";
    setAdminKey(saved);
    setKeyInput(saved);
  }, []);

  async function fetchList() {
    setError("");
    setToast("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/list", {
        headers: { "x-admin-key": adminKey || "" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load");
      setItems(data.items || []);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!adminKey) return;
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((x) => (x.status || "pending").toLowerCase() === filter);
  }, [items, filter]);

  function saveKey() {
    const v = (keyInput || "").trim();
    window.localStorage.setItem("egm_admin_key", v);
    setAdminKey(v);
    setToast("Admin key saved.");
  }

  async function setStatus(id, status) {
    setError("");
    setToast("");
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/set-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey || "",
        },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update");
      setToast(`Updated: ${status.toUpperCase()}`);
      await fetchList();
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Submissions Inbox</h1>
          <p style={styles.subtitle}>Approve or reject submissions. (Admin-only)</p>
        </div>

        <div style={styles.controls}>
          <input
            style={styles.input}
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="ADMIN_KEY"
          />
          <button style={{ ...styles.button, ...styles.primary }} onClick={saveKey}>
            Save key
          </button>

          <select style={styles.input} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button style={styles.button} onClick={fetchList} disabled={!adminKey || loading}>
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      <div style={styles.wrap}>
        {error ? <div style={styles.error}><b>Error:</b> {error}</div> : null}
        {toast ? <div style={styles.toast}>{toast}</div> : null}

        <div style={{ ...styles.card, marginTop: 14 }}>
          <div style={styles.cardHead}>
            <div>
              <div style={{ fontWeight: 900 }}>Submissions</div>
              <div style={styles.small}>
                Showing {filtered.length} of {items.length}
              </div>
            </div>
            <div style={styles.small}>
              Tip: set status → auto-sends email on approve/reject (if artist email exists).
            </div>
          </div>

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Created</th>
                  <th style={styles.th}>Playlist</th>
                  <th style={styles.th}>Track</th>
                  <th style={styles.th}>Artist</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Instagram</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td style={styles.td}>{s.created_at ? new Date(s.created_at).toLocaleString() : "-"}</td>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 800 }}>{s.playlist_name || "-"}</div>
                      <div style={styles.small}>{s.playlist_id || ""}</div>
                    </td>
                    <td style={styles.td}>
                      {s.submitted_track_url ? (
                        <a style={styles.link} href={s.submitted_track_url} target="_blank" rel="noreferrer">
                          Open track
                        </a>
                      ) : "-"}
                      {s.pitch ? <div style={{ marginTop: 8, color: BRAND.muted }}><i>{s.pitch}</i></div> : null}
                    </td>
                    <td style={styles.td}>{s.artist_name || "-"}</td>
                    <td style={styles.td}>{s.email || "-"}</td>
                    <td style={styles.td}>{s.instagram || "-"}</td>
                    <td style={styles.td}><StatusBadge status={s.status} /></td>
                    <td style={styles.td}>
                      <div style={styles.rowActions}>
                        <button
                          style={{ ...styles.button, background: "rgba(30,158,103,0.12)", border: "1px solid rgba(30,158,103,0.25)" }}
                          disabled={!adminKey || busyId === s.id}
                          onClick={() => setStatus(s.id, "approved")}
                          title="Approve + email"
                        >
                          {busyId === s.id ? "Working…" : "Approve"}
                        </button>

                        <button
                          style={{ ...styles.button, background: "rgba(226,74,74,0.10)", border: "1px solid rgba(226,74,74,0.25)" }}
                          disabled={!adminKey || busyId === s.id}
                          onClick={() => setStatus(s.id, "rejected")}
                          title="Reject + email"
                        >
                          {busyId === s.id ? "Working…" : "Reject"}
                        </button>

                        <button
                          style={styles.button}
                          disabled={!adminKey || busyId === s.id}
                          onClick={() => setStatus(s.id, "pending")}
                          title="Set back to pending"
                        >
                          Pending
                        </button>
                      </div>
                      <div style={{ ...styles.small, marginTop: 8 }}>
                        ID: {String(s.id).slice(0, 8)}…
                      </div>
                    </td>
                  </tr>
                ))}

                {!filtered.length ? (
                  <tr>
                    <td style={styles.td} colSpan={8}>
                      {adminKey ? "No submissions found for this filter." : "Enter ADMIN_KEY to load submissions."}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: 14, color: BRAND.muted, fontSize: 12 }}>
          Security note: this page uses an admin key stored in your browser (localStorage) and checked server-side.
        </div>
      </div>
    </div>
  );
}

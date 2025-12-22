import { createClient } from "@supabase/supabase-js";

function requireAdmin(req) {
  const key = req.headers["x-admin-key"];
  if (!process.env.ADMIN_KEY) return { ok: false, error: "Missing ADMIN_KEY env var" };
  if (!key || key !== process.env.ADMIN_KEY) return { ok: false, error: "Unauthorized" };
  return { ok: true };
}

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// --- EDIT THESE (your final email copy + links) ---
const EMAIL_FROM = "submit@egmplaylists.eu";

const SOCIALS = {
  website: "https://www.egmplaylists.eu",
  instagram: "https://www.instagram.com/egmplaylists", // pas aan
  youtube: "https://www.youtube.com/@egmplaylists",     // pas aan
  facebook: "https://www.facebook.com/egmplaylists",    // pas aan
};

function approveEmail({ artistName, playlistName, trackUrl }) {
  const name = artistName || "there";
  const pl = playlistName || "our playlist";
  const track = trackUrl || "";

  const subject = `Approved — ${pl} (EGM Playlists)`;

  const html = `
  <div style="font-family: Arial, sans-serif; line-height:1.55; color:#1F2A33;">
    <p>Hi ${escapeHtml(name)},</p>

    <p>Great news — your submission has been <b>approved</b> for <b>${escapeHtml(pl)}</b>.</p>

    ${track ? `<p><b>Track:</b> <a href="${escapeAttr(track)}">${escapeHtml(track)}</a></p>` : ""}

    <p>Thank you for submitting your music to EGM Playlists. We truly appreciate your trust and support.</p>

    <p>
      Stay connected:<br/>
      • Website: <a href="${SOCIALS.website}">${SOCIALS.website}</a><br/>
      • Instagram: <a href="${SOCIALS.instagram}">${SOCIALS.instagram}</a><br/>
      • YouTube: <a href="${SOCIALS.youtube}">${SOCIALS.youtube}</a><br/>
      • Facebook: <a href="${SOCIALS.facebook}">${SOCIALS.facebook}</a>
    </p>

    <p>Best regards,<br/><b>EGM Playlists</b><br/>${EMAIL_FROM}</p>

    <hr style="border:none;border-top:1px solid #eee;margin:18px 0;" />
    <p style="font-size:12px;color:#5F6B76;">
      You’re receiving this email because you submitted a track to EGM Playlists.
    </p>
  </div>
  `;

  return { subject, html };
}

function rejectEmail({ artistName, playlistName, trackUrl }) {
  const name = artistName || "there";
  const pl = playlistName || "our playlist";
  const track = trackUrl || "";

  const subject = `Update on your submission — ${pl} (EGM Playlists)`;

  const html = `
  <div style="font-family: Arial, sans-serif; line-height:1.55; color:#1F2A33;">
    <p>Hi ${escapeHtml(name)},</p>

    <p>Thank you for submitting your track to <b>${escapeHtml(pl)}</b>.</p>

    ${track ? `<p><b>Track:</b> <a href="${escapeAttr(track)}">${escapeHtml(track)}</a></p>` : ""}

    <p>
      Unfortunately we can’t move forward with this submission at this time.
      Please don’t be discouraged — feel free to submit a future release that fits the playlist direction.
    </p>

    <p>
      Stay connected:<br/>
      • Website: <a href="${SOCIALS.website}">${SOCIALS.website}</a><br/>
      • Instagram: <a href="${SOCIALS.instagram}">${SOCIALS.instagram}</a>
    </p>

    <p>Best regards,<br/><b>EGM Playlists</b><br/>${EMAIL_FROM}</p>

    <hr style="border:none;border-top:1px solid #eee;margin:18px 0;" />
    <p style="font-size:12px;color:#5F6B76;">
      You’re receiving this email because you submitted a track to EGM Playlists.
    </p>
  </div>
  `;

  return { subject, html };
}

// Very small HTML escaping helpers
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => (
    { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[m]
  ));
}
function escapeAttr(str) {
  return escapeHtml(str);
}

async function sendEmailResend({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    return { ok: false, error: "Missing RESEND_API_KEY env var" };
  }

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `EGM Playlists <${EMAIL_FROM}>`,
      to: [to],
      subject,
      html,
    }),
  });

  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) return { ok: false, error: data?.message || "Failed to send email" };
  return { ok: true, data };
}

export default async function handler(req, res) {
  const auth = requireAdmin(req);
  if (!auth.ok) return res.status(401).json({ error: auth.error });

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { id, status } = req.body || {};
    const nextStatus = String(status || "").toLowerCase();

    if (!id) return res.status(400).json({ error: "Missing id" });
    if (!["pending", "approved", "rejected"].includes(nextStatus)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Get submission
    const { data: row, error: getErr } = await supabase
      .from("submissions")
      .select("*")
      .eq("id", id)
      .single();

    if (getErr) return res.status(500).json({ error: getErr.message });
    if (!row) return res.status(404).json({ error: "Not found" });

    // Update status
    const { error: upErr } = await supabase
      .from("submissions")
      .update({ status: nextStatus })
      .eq("id", id);

    if (upErr) return res.status(500).json({ error: upErr.message });

    // Send email for approved/rejected if email exists
    let emailResult = null;
    if ((nextStatus === "approved" || nextStatus === "rejected") && row.email) {
      const payload =
        nextStatus === "approved"
          ? approveEmail({ artistName: row.artist_name, playlistName: row.playlist_name, trackUrl: row.submitted_track_url })
          : rejectEmail({ artistName: row.artist_name, playlistName: row.playlist_name, trackUrl: row.submitted_track_url });

      emailResult = await sendEmailResend({
        to: row.email,
        subject: payload.subject,
        html: payload.html,
      });
    }

    return res.status(200).json({ ok: true, status: nextStatus, emailResult });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}


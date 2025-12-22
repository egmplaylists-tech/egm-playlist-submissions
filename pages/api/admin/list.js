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

export default async function handler(req, res) {
  const auth = requireAdmin(req);
  if (!auth.ok) return res.status(401).json({ error: auth.error });

  try {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ items: data || [] });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}

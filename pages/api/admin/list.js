import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw error;
    res.status(200).json({ items: data || [] });
  } catch (e) {
    res.status(500).json({ error: e.message || "Error" });
  }
}

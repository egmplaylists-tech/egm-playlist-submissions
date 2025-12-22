import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    // sanity check: env vars aanwezig?
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return res.status(500).json({
        error: "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY",
      });
    }

    const { data: gates, error: gatesErr } = await supabase
      .from("gates_config")
      .select("follow_playlist, follow_curator, save_track, presave")
      .eq("id", 1)
      .single();

    if (gatesErr) {
      return res.status(500).json({ error: `gates_config error: ${gatesErr.message}` });
    }

    const { data: playlists, error: plErr } = await supabase
      .from("playlists")
      .select("name, spotify_playlist_id, spotify_url, is_active, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (plErr) {
      return res.status(500).json({ error: `playlists error: ${plErr.message}` });
    }

    return res.status(200).json({ gates, playlists });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}

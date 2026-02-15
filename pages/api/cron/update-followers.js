import { exec } from "child_process";

export default async function handler(req, res) {
  try {
    exec("node updateFollowers.mjs", (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
      }
      console.log(stdout);
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

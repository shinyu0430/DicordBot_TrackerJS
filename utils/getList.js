const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");

module.exports = {
  name: "getList",
  async execute(guildID, userID) {
    const client = supabase.createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    // fetch
    const { data, _ } = await client
      .from("tasks")
      .select("task_name, created_at, id, done")
      .match({ guild_id: guildID, user_id: userID })
      .order("created_at", { ascending: true });
    return data
  },
};

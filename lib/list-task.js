const supabase = require("@supabase/supabase-js");

module.exports = {
  name: "list-task",
  async execute(guildID, userID) {
    const client = supabase.createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    const { data, _ } = await client
      .from("tasks")
      .select("task_name, created_at, done")
      .match({ guild_id: guildID, user_id: userID })
      .order("created_at", { ascending: true });

    if (data.length === 0) return "Well-Done! :partying_face:";

    let out = "";
    for (let i = 0; i < data.length; i++) {
      out += `${i + 1}. ${data[i]["done"] === true ? "~~" : ""}${
        data[i]["task_name"]
      }${data[i]["done"] === true ? "~~" : ""}\n`;
    }

    return out;
  },
};

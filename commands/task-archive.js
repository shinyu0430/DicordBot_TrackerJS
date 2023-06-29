const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");

module.exports = {
  name: "!task-archive",
  async execute(msg) {
    const client = supabase.createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    // hash id
    const hashID = sha256(msg.author.id).toString();
    const hashGID = sha256(msg.guild.id).toString();

    // get tasks
    const archiveTasks = msg.content.split("\n").slice(1);

    // fetch data
    const { data, _ } = await client
      .from("tasks")
      .select("guild_id, user_id, task_name, done")
      .match({ guild_id: hashGID, user_id: hashID })
      .in("task_name", archiveTasks)
      .order("created_at", { ascending: true });

    // remove old data
    await client
      .from("tasks")
      .delete()
      .match({ guild_id: hashGID, user_id: hashID })
      .in("task_name", archiveTasks);

    // insert to archived table
    await client.from("archived").insert(data);

    await msg.reply("Archived!");
  },
};

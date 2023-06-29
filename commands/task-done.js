const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");
const listTask = require("../lib/list-task");

module.exports = {
  name: "!task-done",
  async execute(msg) {
    const client = supabase.createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    // hash
    const hashID = sha256(msg.author.id).toString();
    const hashGID = sha256(msg.guild.id).toString();

    // parse
    const doneIdx = msg.content.split(" ").slice(1);

    // fetch
    const { data, _ } = await client
      .from("tasks")
      .select("id")
      .match({ guild_id: hashGID, user_id: hashID })
      .order("created_at", { ascending: true });

    // add into doneData
    let doneIDs = [];
    for (let i = 0; i < doneIdx.length; i++)
      doneIDs.push(data[doneIdx[i] - 1]["id"]);

    // update
    await client
      .from("tasks")
      .update({ done: true })
      .match({ guild_id: hashGID, user_id: hashID })
      .in("id", doneIDs);

    // display
    let out = await listTask.execute(hashGID, hashID);
    await msg.reply(out);
  },
};

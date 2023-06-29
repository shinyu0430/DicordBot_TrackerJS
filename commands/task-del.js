const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");
const listTask = require("../lib/list-task");

module.exports = {
  name: "!task-del",
  async execute(msg) {
    const client = supabase.createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    const hashID = sha256(msg.author.id).toString();
    const hashGID = sha256(msg.guild.id).toString();
    let deleteData = [];

    const parsedMsg = msg.content.split("\n");
    for (let i = 1; i < parsedMsg.length; i++) {
      deleteData.push(parsedMsg[i]);
    }

    await client
      .from("tasks")
      .delete()
      .match({ guild_id: hashGID, user_id: hashID })
      .in("task_name", deleteData);
    let out = await listTask.execute(hashGID, hashID);
    await msg.reply(out);
  },
};

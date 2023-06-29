const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");
const listTask = require("../lib/list-task");

module.exports = {
  name: "!task-new",
  async execute(msg) {
    const client = supabase.createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

		// hash
    const hashID = sha256(msg.author.id).toString();
    const hashGID = sha256(msg.guild.id).toString();

		// parse
    let insertData = [];
    const parsedMsg = msg.content.split("\n");
    for (let i = 1; i < parsedMsg.length; i++)
      insertData.push({
        guild_id: hashGID,
        user_id: hashID,
        task_name: parsedMsg[i],
      });

		// insert
    await client.from("tasks").insert(insertData);

		// display
    let out = await listTask.execute(hashGID, hashID);
    await msg.reply(out);
  },
};

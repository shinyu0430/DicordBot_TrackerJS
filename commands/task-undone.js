const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");
const listTask = require("../lib/showTaskList");
const getList = require("../utils/getList");


module.exports = {
  name: "!task-undone",
  async execute(msg) {
    const client = supabase.createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    // hash
    const hashGID = sha256(msg.guild.id).toString();
    const hashID = sha256(msg.author.id).toString();

    // parse data
    const undoneIdx = msg.content.split(" ").slice(1);

    // fetch
    const data = await getList.execute(hashGID, hashID);
    if (!data) await msg.reply("There is no task to undone:thinking:!");

    // add into doneData
    let doneIDs = [];
    try{
      doneIDs = undoneIdx.map((index) => data[index - 1]["id"]);
    }catch{
      await msg.reply("Please enter valid index:sob:!");
      return;
    }

    // update
    await client
      .from("tasks")
      .update({ done: false })
      .match({ guild_id: hashGID, user_id: hashID })
      .in("id", doneIDs);

    // display
    let out = await listTask.execute(hashGID, hashID);
    await msg.reply(out);
  },
};

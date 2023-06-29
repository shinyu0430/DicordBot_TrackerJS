const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");
const listTask = require("../lib/list-task");
const getList = require("../utils/getList");

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
    const data = await getList.execute(hashGID, hashID);
    if (!data) {
      await msg.reply("There is no task to undone:thinking:!");
      return;
    }

    // add into doneData
    let doneIDs = [];
    try{
      doneIDs = doneIdx.map((idx) => data[idx - 1]["id"]);
    }catch(err){
      await msg.reply("Please enter valid index:sob:!");
      return;
    }
    

    // update
    await client
      .from("tasks")
      .update({ done: true })
      .match({ guild_id: hashGID, user_id: hashID })
      .in("id", doneIDs);

    // display
    const out = await listTask.execute(hashGID, hashID);
    await msg.reply(out);
  },
};

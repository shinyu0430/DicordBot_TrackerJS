const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");
const listTask = require("../lib/list-task");
const getList = require("../utils/getList");

module.exports = {
  name: "!task-del",
  async execute(msg) {
    const client = supabase.createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
    
    // hash
    const hashGID = sha256(msg.guild.id).toString();
    const hashID = sha256(msg.author.id).toString();

    // parse data
    const deleteIdx = msg.content.split(" ").slice(1);

    // fetch
    const data = await getList.execute(hashGID, hashID);
    if (!data) await msg.reply("There is no task to delete:thinking:!");
    
    // add into doneData
    let deleteIDs = [];
    try{
      deleteIDs = deleteIdx.map((idx) => data[idx - 1]["id"]);
    }catch{
      await msg.reply("Please enter valid index:sob:!");
      return;
    }

    // update
    await client
      .from("tasks")
      .delete()
      .match({ guild_id: hashGID, user_id: hashID })
      .in("id", deleteIDs);

    let out = await listTask.execute(hashGID, hashID);
    await msg.reply(out);
  },
};

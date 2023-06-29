const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");

module.exports = {
  name: "!group-assign",
  async execute(msg) {
    const client = supabase.createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    // parse command
    const parsedLine = msg.content.split("\n");
    const cmd = parsedLine[0];
    const group = cmd.split(" ")[1];

    // hash
    const hashGID = sha256(msg.guild.id).toString();

    // fetch user_ids
    const { data, _ } = await client
      .from("group")
      .select("user_id")
      .match({ group_name: group, guild_id: hashGID });

    if (data === null || data.length === 0) {
      await msg.reply(`There's no member in ${group}`);
      return;
    }

    const ids = data.map((item) => item.user_id);

    // parse tasks
    const tasks = parsedLine.slice(1);
    let insertData = [];
    for (let i = 0; i < ids.length; i++)
      for (let j = 0; j < tasks.length; j++)
        insertData.push({
          guild_id: hashGID,
          user_id: ids[i],
          task_name: tasks[j],
        });

    // insert into tasks table
    await client.from("tasks").insert(insertData);
    await msg.reply(`Assined tasks to ${group}`);
  },
};

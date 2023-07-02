const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");

module.exports = {
  name: "!group-list",
  async execute(msg) {
    const client = supabase.createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // hash
    const hashGID = sha256(msg.guild.id).toString();

    // fetch
    const { data, _ } = await client
      .from("group")
      .select("group_name, guild_group!inner(guild_id), group_user(user_id)")
      .eq("guild_group.guild_id", hashGID);
    
    if (!data.length) {
      await msg.reply(
        "There's no group! Create one by sending `!group-join <group_name>`"
      );
      return;
    }

    let output = "## Group List \n";
    const formattedString = data
      .map((item) => `- ${item.group_name}`)
      .join("\n");
    output += formattedString;
    await msg.reply(output);
  },
};

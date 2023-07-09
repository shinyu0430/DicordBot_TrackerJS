const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");

module.exports = {
  name: "!track-leave",
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
    const hashID = sha256(msg.author.id).toString();
    const hashGID = sha256(msg.guild.id).toString();

    // parse
    const parsedMsg = msg.content.split(" ");
    const accountID = parsedMsg[1];

    if (!accountID) {
      await msg.reply("Please enter !track-leave <Leetcode account ID>");
      return;
    }

    const { data: deletedData, error: deleteError } = await client
      .from("track_user")
      .delete()
      .eq("guild_id", hashGID)
      .eq("account_id", accountID);

    if (deleteError) {
      console.error("Error deleting data:", deleteError.message);
      return;
    }

    await msg.reply(
      `Escape successful! No \`${accountID}\` in my tracking notes.`
    );
  },
};

const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");

module.exports = {
  name: "!track-join",
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

    const data = {
      guild_id: hashGID,
      account_id: accountID,
    };

    if (!accountID) {
      await msg.reply("Please enter `!track-join <Leetcode account ID>`");
      return;
    }
    const { data: insertedData, error: insertError } = await client
      .from("track_user")
      .upsert(data);

    if (insertError) {
      console.error("Error upserting data:", insertError.message);
      return;
    }

    await msg.reply(`Ta-da! \`${accountID}\` is now in my tracking notes:notepad_spiral:.`);
  },
};

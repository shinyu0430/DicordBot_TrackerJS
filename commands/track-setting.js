const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");

module.exports = {
  name: "!track-setting",
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
    const changeCmd = parsedMsg[1];

    let channelId;
    if (changeCmd == "on") {
      condi = true;
      channelId = parsedMsg[2] ? parsedMsg[2] : msg.channel.id;
    } else if (changeCmd == "off") {
      condi = false;
    } else {
      await msg.reply(`Enter \`on\` or \`off\` to change the setting!`);
      return;
    }

    const data = {
      guild_id: hashGID,
      execute: condi,
      channel_id: channelId,
    };

    const { data: existingData, error } = await client
      .from("track")
      .select("*")
      .eq("guild_id", hashGID);

    if (error) {
      console.error("Error fetching data:", error.message);
      return;
    }

    if (existingData.length > 0) {
      const { data: updatedData, error: updateError } = await client
        .from("track")
        .update({ execute: condi, channel_id: channelId })
        .eq("guild_id", hashGID);

      if (updateError) {
        console.error("Error updating data:", updateError.message);
        return;
      }
    } else {
      const { data: insertedData, error: insertError } = await client
        .from("track")
        .insert(data);

      if (insertError) {
        console.error("Error inserting data:", insertError.message);
        return;
      }
    }
    if (condi) {
      await msg.reply(`
      Watch out! Quokka's keeping a sharp watch on you!!\nChannel ID: ${channelId}\nhttps://tenor.com/bnGDK.gif
      `);
    } else {
      await msg.reply(
        `Aw, it's okay! The quokka understands. Daily tracking cancelled!`
      );
    }
  },
};

const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");

module.exports = {
  name: "!group-leave",
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
    const groupName = parsedMsg[1];
    const userName = msg.author.username;

    /**
     * Checks if a guild has a specific group.
     * @returns {Object} - An object containing information about the group.
     * - isInGuild {boolean}: Whether the guild has the group.
     * - groupId {string}: The group id.
     * - isEmpty {boolean}: Whether the group would be empty after user leave.
     */
    async function checkGuildGroup(guildId, groupName) {
      const { data, error } = await client
        .from("group")
        .select("group_name, id, guild_group(guild_id),group_user(user_id)")
        .eq("group_name", groupName)
        .eq("guild_group.guild_id", guildId);

      if (error) {
        console.error("Error retrieving guild groups:", error.message);
        return;
      }

      if (!data.length) {
        return { isInGuild: false, groupId: null, isEmpty: null };
      }
      
      const groupId = data[0].id;
      const isEmpty = data[0].group_user.length < 2;
      return { isInGuild: true, groupId: groupId, isEmpty: isEmpty };
    }
    /**
     * Checks if a user is in a group.
     * @returns {boolean} - True if the user is in the group, false otherwise.
     */
    async function checkUserInGroup(groupId, userId) {
      const { data, error } = await client
        .from("group_user")
        .select("*")
        .eq("user_id", userId)
        .eq("group_id", groupId);

      return data.length > 0;
    }

    /**
     * Deletes a user from a group.
     */
    async function deleteUserFromGroup(groupId, userId) {
      await client
        .from("group_user")
        .delete()
        .eq("user_id", userId)
        .eq("group_id", groupId);
    }

    /**
     * Deletes a group from the database.
     */
    async function deleteGroup(groupId) {
      await client.from("group").delete().eq("id", groupId);
    }
    
    const { isInGuild, groupId, isEmpty } = await checkGuildGroup(
      hashGID,
      groupName
    );

    if (!isInGuild) {
      if(groupName){
        await msg.reply(`There is no group named ${groupName}! Create one by sending \`!group-join <group_name>\``)
      }else{
        await msg.reply("Please enter valid group name!");
      }
      return;
    }

    const isInGroup = await checkUserInGroup(groupId, hashID);
    if (isInGroup) {
      await deleteUserFromGroup(groupId, hashID);
      await msg.reply(`${userName} leaves ${groupName}`);
      if (isEmpty) {
        await deleteGroup(groupId);
        await msg.reply(`${userName} deletes ${groupName}`);
      }
    } else {
      await msg.reply(`${userName} is not in ${groupName}`);
    }
  },
};

const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");

module.exports = {
  name: "!group-join",
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

    /**
     * Creates a group for a guild.
     * @returns {string} - The ID of the created group.
     */
    async function createGroup(guildId, groupName) {
      try {
        const { data } = await client
          .from("group")
          .insert({ group_name: groupName })
          .select("*");

        const groupId = data[0].id;
        await client
          .from("guild_group")
          .insert({ group_id: groupId, guild_id: guildId });

        await msg.reply(`${msg.author.username} creates ${groupName}`);
        return groupId;
      } catch (error) {
        console.error("Error create group:", error.message);
      }
    }
    /**
     * Adds a user to a group.
     */
    async function addUserToGroup(groupId, userId) {
      try {
        await client
          .from("group_user")
          .insert([{ group_id: groupId, user_id: userId }]);

        await msg.reply(`${msg.author.username} joins ${groupName}`);
      } catch (error) {
        console.error("Error adding user to group:", error.message);
      }
    }

    /**
     * Check if a guild has a specific group
     * @returns {Object} - An object containing the result of the check
     * - isInGuild: boolean - Whether the guild has the group
     * - groupId: string|null - The group id
     */
    async function checkGuildGroup(guildId, groupName) {
      try {
        const { data } = await client
          .from("group")
          .select("group_name, id, guild_group!inner(guild_id)")
          .eq("group_name", groupName);
        if (data.length > 0) {
          return { isInGuild: true, groupId: data[0].id };
        } else {
          return { isInGuild: false, groupId: null };
        }
      } catch (error) {
        console.log("Error checking guild's groups:", error.message);
      }
    }

    const { isInGuild, groupId } = await checkGuildGroup(hashGID, groupName);
    if (isInGuild) {
      await addUserToGroup(groupId, hashID);
    } else {
      const groupId = await createGroup(hashGID, groupName);
      await addUserToGroup(groupId, hashID);
    }
  },
};

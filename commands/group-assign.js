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
    const groupName = cmd.split(" ")[1];
    const tasks = parsedLine.slice(1);

    // check users' input
    if (!tasks.length) {
      msg.reply("Please enter valid task!");
      return;
    }

    // hash
    const hashGID = sha256(msg.guild.id).toString();

    /**
     * Check if a guild group exists.
     * @returns {Object} - An object containing the guild group data.
     *   - isGroupExist {boolean}: Whether the group exists.
     *   - groupId {string}: The group id.
     */
    async function checkGuildGroup(guildId, groupName) {
      try {
        const { data } = await client
          .from("group")
          .select("group_name, id, guild_group!inner(guild_id)")
          .eq("group_name", groupName);

        if (data.length) {
          return { isGroupExist: true, groupId: data[0].id };
        } else {
          return { isGroupExist: false, groupId: "" };
        }
      } catch (error) {
        console.log("Error while checking guild group:", error.message);
      }
    }

    /**
     * Retrieves users in a specific group.
     *  @returns {Promise<{ data: any }>} - A promise that resolves with an object containing the user data.
     */
    async function getUsersInGroup(groupId) {
      try {
        const { data } = await client
          .from("group_user")
          .select("*")
          .eq("group_id", groupId);
        return { data };
      } catch (error) {
        console.log("Error while getting users in group", error.message);
      }
    }

    /**
     * Retrieves the user IDs in a specific group.
     * @returns {Array<string>} - An array of user IDs in the group.
     */
    async function getUserIdInGroup(hashGID, groupName) {
      try {
        const { isGroupExist, groupId } = await checkGuildGroup(
          hashGID,
          groupName
        );
        if (isGroupExist) {
          const { data } = await getUsersInGroup(groupId);
          const usersId = data.map((item) => {
            return item.user_id;
          });
          return usersId;
        } else {
          if(groupName){
            await msg.reply(`There's no ${groupName}!`);
          }else{
            await msg.reply("Please enter valid group name!");
          }
          return;
        }
      } catch (error) {
        console.log("Error while getting user ids:", error.message);
      }
    }

    // parse tasks
    const ids = await getUserIdInGroup(hashGID, groupName);
    console.log(ids)
    let insertData = [];
    for (let i = 0; i < ids.length; i++)
      for (let j = 0; j < tasks.length; j++)
        insertData.push({
          guild_id: hashGID,
          user_id: ids[i],
          task_name: tasks[j],
        });

    // insert into tasks table
    const { _, error } = await client.from("tasks").insert(insertData);
    if (error) {
      console.log("Error while inserting tasks", error.message);
      return;
    } else {
      await msg.reply(`Assined tasks to ${groupName} successfully!`);
    }
  },
};

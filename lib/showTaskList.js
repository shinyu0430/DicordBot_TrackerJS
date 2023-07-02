const supabase = require("@supabase/supabase-js");
const getList = require("../utils/getList");

module.exports = {
  name: "list-task",
  async execute(guildID, userID) {
    const client = supabase.createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    const data = await getList.execute(guildID, userID);
    if (!data.length) return "Well-Done! :partying_face:";
    let out = data
      .map((item, index) => {
        const done = item["done"];
        const taskName = item["task_name"];
        const formattedTaskName = done ? `~~${taskName}~~` : taskName;
        return `${index + 1}. ${formattedTaskName}\n`;
      })
      .join("");

    return out;
  },
};

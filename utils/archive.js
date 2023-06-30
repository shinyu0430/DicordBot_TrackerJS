const supabase = require("@supabase/supabase-js");

module.exports = {
  name: "taskArchive",
  async execute() {
    const client = supabase.createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );

    // fetch data
    const { data, err } = await client
      .from("tasks")
      .select("guild_id, user_id, task_name, done")
      .order("created_at", { ascending: true });
    if (err) {
      console.log("Fetch failed");
      return;
    }

    // remove old data
    await client.from("tasks").delete().in("done", [true, false]);

    // archive data
    let archiveData = [];
    const date = new Date();
    for (let i = 0; i < data.length; i++) {
      // Increase the seconds of the date by the index value
      date.setSeconds(date.getSeconds() + i);

      // Convert the date to a string formatted as YYYY-MM-DD HH:MI:SS
      const formattedDate = `${date
        .toISOString()
        .replace("T", " ")
        .replace(/\.\d+Z$/, "")}`;

      archiveData.push({
        guild_id: data[i]["guild_id"],
        user_id: data[i]["user_id"],
        task_name: data[i]["task_name"],
        archived_at: formattedDate,
      });
    }

    // insert to archived table
    await client.from("archived").insert(archiveData);
  },
};

const supabase = require("@supabase/supabase-js");

module.exports = {
	name: "list-task",
	async execute(userID) {
		const client = supabase.createClient(
			process.env.SUPABASE_URL,
			process.env.SUPABASE_KEY
		);

		const { data, _ } = await client
			.from("tasks")
			.select("task_name, created_at, done")
			.eq("user_id", userID)
			.order("created_at", { ascending: true });

		if (data.length === 0) {
			await msg.reply("Well-Done! :partying_face:");
			return;
		}

		let out = "";
		for (let i = 0; i < data.length; i++) {
			out += `${data[i]["done"] === true ? ":o:" : ":x:"}  ${data[i]["task_name"]
				}\n`;
		}

		return out;
	},
};

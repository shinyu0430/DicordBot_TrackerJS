const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");
const listTask = require("../lib/list-task");

module.exports = {
	name: "!task-new",
	async execute(msg) {
		const client = supabase.createClient(
			process.env.SUPABASE_URL,
			process.env.SUPABASE_KEY
		);

		const hashID = sha256(msg.author.id).toString();
		let insertData = [];

		const parsedMsg = msg.content.split("\n");
		for (let i = 1; i < parsedMsg.length; i++)
			insertData.push({ user_id: hashID, task_name: parsedMsg[i] });

		await client.from("tasks").insert(insertData);
		let out = await listTask.execute(hashID);
		await msg.reply(out);
	},
};

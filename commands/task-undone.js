const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");
const listTask = require("../lib/list-task");

module.exports = {
	name: "!task-undone",
	async execute(msg) {
		const client = supabase.createClient(
			process.env.SUPABASE_URL,
			process.env.SUPABASE_KEY
		);

		// hash ids
		const hashID = sha256(msg.author.id).toString();
		const hashGID = sha256(msg.guild.id).toString();

		// parse data
		let doneData = [];
		const parsedMsg = msg.content.split("\n");
		for (let i = 1; i < parsedMsg.length; i++) {
			doneData.push(parsedMsg[i]);
		}

		// update
		await client
			.from("tasks")
			.update({ done: false })
			.match({ guild_id: hashGID, user_id, hashID})
			.in("task_name", doneData);

		// display
		let out = await listTask.execute(hashGID, hashID);
		await msg.reply(out);
	},
};

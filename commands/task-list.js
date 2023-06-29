const sha256 = require("crypto-js/sha256");
const listTask = require("../lib/list-task");

module.exports = {
	name: "!task-list",
	async execute(msg) {
		const hashID = sha256(msg.author.id).toString();
		let out = await listTask.execute(hashID);
		await msg.reply(out);
	},
};

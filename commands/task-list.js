const sha256 = require("crypto-js/sha256");
const listTask = require("../lib/showTaskList");

module.exports = {
	name: "!task-list",
	async execute(msg) {
		// hash
		const hashID = sha256(msg.author.id).toString();
		const hashGID = sha256(msg.guild.id).toString();

		// call display function
		let out = await listTask.execute(hashGID, hashID);
		await msg.reply(out);
	},
};

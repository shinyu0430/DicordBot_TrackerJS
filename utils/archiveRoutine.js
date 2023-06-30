const cron = require("cron");
const { execute } = require("./archive");
const archive = require("./archive");

// cron, do the archive task
const archive_tasks = new cron.CronJob(
	"0 0 0 * * 0", // do each 30s
	() => {
		console.log("Archive");
		archive.execute();
	}
);
module.exports = {
	name: "archive-routine",
	execute() {
		archive_tasks.start();
	},
};

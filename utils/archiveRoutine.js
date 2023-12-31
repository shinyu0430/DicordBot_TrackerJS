const cron = require("cron");
const { execute } = require("./archive");
const archive = require("./archive");

// cron, do the archive task
const archive_tasks = new cron.CronJob(
	"0 0 16 * * 0", // do every Sunday
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

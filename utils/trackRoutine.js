const cron = require("cron");
const track = require("./track");

// cron, do the archive task
const track_tasks = new cron.CronJob(
    "0 14 * * *",
    () => {
      console.log("Track");
      track.execute();
    }
  );
  

module.exports = {
  name: "track-routine",
  execute() {
    track_tasks.start();
  },
};

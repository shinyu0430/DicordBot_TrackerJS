const cron = require("cron");
const track = require("./track");

// cron, do the archive task
const track_tasks = new cron.CronJob(
    "00 22 * * *",
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

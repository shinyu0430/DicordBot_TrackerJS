const supabase = require("@supabase/supabase-js");
const axios = require("axios");
const { DateTime } = require("luxon");
const bot = require("./client.js");
const Discord = require("discord.js");

const url = "https://leetcode.com/graphql";

const payload = {
  operationName: "getRecentSubmissionList",
  variables: {
    limit: 30,
  },
  query: `
    query getRecentSubmissionList($username: String!, $limit: Int) {
      recentSubmissionList(username: $username, limit: $limit) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }
      languageList {
        id
        name
        verboseName
        __typename
      }
    }
  `,
};

module.exports = {
  name: "track",
  async execute() {
    const supabase = require("@supabase/supabase-js");
    const client = supabase.createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    let result = "";
    const formattedData = await fetchUserInfo();

    async function fetchUserInfo() {
      const response = await client
        .from("track_user")
        .select("guild_id, account_id");

      if (response.error) {
        console.error("Error fetching data:", response.error.message);
        return [];
      }

      const data = response.data;
      const formattedData = [];
      for (const row of data) {
        const { guild_id, account_id } = row;

        const channelResponse = await client
          .from("track")
          .select("guild_id, channel_id")
          .eq("guild_id", guild_id)
          .eq("execute", true);

        if (channelResponse.error) {
          console.error(
            "Error fetching channel data:",
            channelResponse.error.message
          );
          continue;
        }

        const channelData = channelResponse.data;
        for (const channelRow of channelData) {
          const { guild_id, channel_id } = channelRow;

          let existingEntry = formattedData.find(
            (entry) => entry.channelid === channel_id
          );

          if (!existingEntry) {
            existingEntry = { channelid: channel_id, users: [] };
            formattedData.push(existingEntry);
          }
          existingEntry.users.push(account_id);
        }
      }

      return formattedData;
    }

    async function getRecentSubmissions(channelId, users) {
      const todayDate = DateTime.local().toFormat("yyyy-MM-dd");
      result = `# ${todayDate}\n`;
      for (const user of users) {
        payload.variables.username = user;

        try {
          const response = await axios.post(url, payload);

          if (response.status === 200) {
            const data = response.data;
            const recentSubmissions = data.data.recentSubmissionList;

            const today = DateTime.local().set({
              hour: 0,
              minute: 0,
              second: 0,
              millisecond: 0,
            });

            const todaySubmissions = filterTodaySubmissions(
              recentSubmissions,
              today
            );
            let userResult = formatUserResult(user, todaySubmissions);

            result += userResult + "\n";
          }
        } catch (error) {
          console.log("error", error);
        }
      }
      sendToChannel(channelId, result);
    }

    async function fetchRecentSubmissions() {
      for (const entry of formattedData) {
        const { channelid, users } = entry;
        await getRecentSubmissions(channelid, users);
      }
    }

    await fetchRecentSubmissions();
  },
};

function filterTodaySubmissions(submissions, today) {
  if(!submissions)  
    return [];
  return submissions.filter(
    (sub) => DateTime.fromSeconds(parseInt(sub.timestamp)) >= today
  );
}

function formatUserResult(user, submissions) {
  let userResult = `## :hatching_chick: ${user}\n`;
  let acCount = 0;
  const checkedTitles = new Set();
  submissions.forEach((submission) => {
    const { title, timestamp, statusDisplay } = submission;
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours}:${minutes}`;
    const emoji =
      statusDisplay === "Accepted" ? ":green_heart:" : ":broken_heart:";
    const submissionStr = `- ${title} ${formattedTime} ${statusDisplay} ${emoji}`;
    userResult += submissionStr + "\n";

    if (statusDisplay === "Accepted" && !checkedTitles.has(title)) {
      acCount++;
      checkedTitles.add(title);
    }
  });

  userResult += `Total AC: ${acCount} 題\n`;
  return userResult;
}

function sendToChannel(channelId, message) {
  const channel = bot.channels.cache.get(channelId);
  if (channel && channel instanceof Discord.TextChannel) {
    channel
      .send(message)
      .then(() => {
        console.log(`Message sent to channel ${channelId}: ${message}`);
      })
      .catch((error) => {
        console.error(
          `Error sending message to channel ${channelId}: ${error}`
        );
      });
  } else {
    console.error(`Channel ${channelId} not found or not a text channel.`);
  }
}

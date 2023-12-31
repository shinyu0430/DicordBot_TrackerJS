const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");
const dotenv = require("dotenv");
const archiveRoutine = require("./utils/archiveRoutine.js");
const trackRoutine = require("./utils/trackRoutine.js");
const express = require("express");
const client = require("./utils/client.js");

// make a endpoint to ping
const app = express();
app.get("/", (req, res) => {
  res.send("Ping");
});
app.listen(3000, () => console.log("Express is listening"));

// load env vars
dotenv.config();

// command prefix
const PREFIX = "!";

// const client = new Client({
//   intents: [
//     Intents.FLAGS.GUILDS,
//     Intents.FLAGS.GUILD_MESSAGES,
//     Intents.FLAGS.MESSAGE_CONTENT,
//   ],
// });

// when it get ready
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("LeetCode");
  archiveRoutine.execute();
  trackRoutine.execute();
});

// read the directory ./commands for all .js files
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

// set command into commands
let commands = new Collection();
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.name, command);
}

// when message created, see if it matches a command
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  else if (!msg.content.startsWith(PREFIX)) return;

  const parsedLine = msg.content.trim(" ").split("\n")[0];
  const parsedCmd = parsedLine.split(" ")[0];

  // if command not found, return, execute otherwise
  if (!commands.has(parsedCmd)) return;
  try {
    commands.get(parsedCmd).execute(msg);
  } catch (err) {
    console.error("whoops! error!");
  }
});

client.login(process.env.DC_TOKEN);

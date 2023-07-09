const supabase = require("@supabase/supabase-js");
const sha256 = require("crypto-js/sha256");

module.exports = {
  name: "!help",
  async execute(msg) {
    const fs = require("fs");
    const filePath = "./static/help.md";
    const markdownContent = fs.readFileSync(filePath, "utf8");
    await msg.reply(markdownContent);
  },
};

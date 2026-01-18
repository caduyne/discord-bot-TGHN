// src/index.js
require("dotenv").config(); // ❗ sửa config(), không phải confiQ()

const { Client } = require("discord.js");

const client = new Client({
  intents: [
    1,        // Guilds
    512,      // GuildMessages
    32768     // MessageContent
  ]
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content === "ping") {
    message.reply("pong");
  }
});

client.login(process.env.TOKEN);

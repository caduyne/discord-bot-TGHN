const { prefix } = require("../config");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const cmdName = args.shift().toLowerCase();

    const command = client.prefixCommands.get(cmdName);
    if (!command) return;

    command.execute(message, args, client);
  }
};

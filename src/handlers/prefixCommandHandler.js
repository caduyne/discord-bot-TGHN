const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  client.prefixCommands = new Map();

  const files = fs.readdirSync(
    path.join(__dirname, "../commands/prefix")
  );

  for (const file of files) {
    const command = require(`../commands/prefix/${file}`);
    client.prefixCommands.set(command.name, command);
  }
};

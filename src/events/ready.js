module.exports = {
  name: "ready",
  execute(client) {
    console.log(`✅ Bot online: ${client.user.tag}`);
  }
};

module.exports = {
  name: "messageReactionAdd",
  async execute(reaction, user, client) {
    if (user.bot) return;
    if (reaction.partial) await reaction.fetch();

    const giveaway = client.giveaways.get(reaction.message.id);
    if (!giveaway) return;

    if (reaction.emoji.name !== "🎉") return;
    if (!giveaway.roleId) return;

    const member = await reaction.message.guild.members.fetch(user.id);
    if (!member.roles.cache.has(giveaway.roleId)) {
      await reaction.users.remove(user.id);
    }
  }
};

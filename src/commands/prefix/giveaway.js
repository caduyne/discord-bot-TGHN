const {
  EmbedBuilder,
  PermissionFlagsBits
} = require("discord.js");

/**
 * n!giveaway <thời_gian> <số_người_thắng> [@role] <phần thưởng>
 * ví dụ:
 * n!giveaway 10m 2 @Level1 Nitro 1 tháng
 * n!giveaway 1h 1 Nitro Classic
 */

module.exports = {
  name: "giveaway",
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply("❌ Bạn không có quyền tạo giveaway");
    }

    // ===== Parse args =====
    const timeArg = args.shift();
    const winnerCount = parseInt(args.shift());

    if (!timeArg || isNaN(winnerCount)) {
      return message.reply(
        "❌ Cú pháp:\n`n!giveaway <thời_gian> <số_người_thắng> [@role] <phần thưởng>`"
      );
    }

    // Role (optional)
    let role = message.mentions.roles.first();
    if (role) args.shift();

    const prize = args.join(" ");
    if (!prize) {
      return message.reply("❌ Bạn chưa nhập phần thưởng");
    }

    // ===== Parse time =====
    const timeMatch = timeArg.match(/^(\d+)(s|m|h|d)$/);
    if (!timeMatch) {
      return message.reply("❌ Thời gian không hợp lệ (vd: 10m, 1h, 2d)");
    }

    const timeValue = parseInt(timeMatch[1]);
    const timeUnit = timeMatch[2];

    const timeMs = {
      s: timeValue * 1000,
      m: timeValue * 60 * 1000,
      h: timeValue * 60 * 60 * 1000,
      d: timeValue * 24 * 60 * 60 * 1000
    }[timeUnit];

    const endTimestamp = Math.floor((Date.now() + timeMs) / 1000);

    // ===== Embed đang diễn ra =====
    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle("🎉 GIVEAWAY 🎉")
      .setDescription(
        `🎁 **Phần thưởng:** ${prize}\n` +
        `⏰ **Kết thúc sau:** <t:${endTimestamp}:R>\n` +
        `🏆 **Số người thắng:** ${winnerCount}\n` +
        `🎭 **Role yêu cầu:** ${role ? role.toString() : "Không"}\n\n` +
        `React 🎉 để tham gia\n\n` +
        `🟢 *Giveaway đang diễn ra...*`
      )
      .setFooter({
        text: `Tạo bởi ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL()
      })
      .setTimestamp();

    const gaMessage = await message.channel.send({
      content: role ? role.toString() : null,
      embeds: [embed]
    });

    await gaMessage.react("🎉");

    // ===== Kết thúc giveaway =====
    setTimeout(async () => {
      const fetched = await gaMessage.fetch();
      const reaction = fetched.reactions.cache.get("🎉");

      if (!reaction) return;

      let users = await reaction.users.fetch();
      users = users.filter(u => !u.bot);

      // Check role
      if (role) {
        users = users.filter(u => {
          const member = message.guild.members.cache.get(u.id);
          return member && member.roles.cache.has(role.id);
        });
      }

      const winners = users.random(Math.min(winnerCount, users.size));

      const winnerMentions =
        winners.length > 0
          ? winners.map(u => `<@${u.id}>`).join(", ")
          : "Không có người thắng";

      // ===== Edit embed khi kết thúc =====
      const endedEmbed = EmbedBuilder.from(embed)
        .setColor("#2ECC71")
        .setDescription(
          `🎁 **Phần thưởng:** ${prize}\n` +
          `⏰ **Đã kết thúc:** <t:${endTimestamp}:f>\n` +
          `🏆 **Số người thắng:** ${winnerCount}\n` +
          `🎭 **Role yêu cầu:** ${role ? role.toString() : "Không"}\n\n` +
          `🔴 *Giveaway đã kết thúc*`
        );

      await gaMessage.edit({ embeds: [endedEmbed] });

      // ===== Reply kết quả =====
      await gaMessage.reply(
        `🎉 **Giveaway đã kết thúc!**\n` +
        `👑 Tạo bởi: ${message.author}\n` +
        `🏆 Người thắng: ${winnerMentions}`
      );
    }, timeMs);
  }
};

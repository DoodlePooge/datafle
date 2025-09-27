import { Collection, SlashCommandBuilder } from "discord.js";

export const commands = new Collection();

commands.set("ping", {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
});

import { Collection, Embed, SlashCommandBuilder } from "discord.js";
import { getWordleSum, getWordle } from "./server/wordle.js";
import QuickChart from "quickchart-js";

const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export const commands = new Collection();

commands.set("ping", {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
});

commands.set("wordle", {
  data: new SlashCommandBuilder()
    .setName("wordle")
    .setDescription("Get wordle stats!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("summary")
        .setDescription("Wordle Summary of the Year")
        .addUserOption((option) =>
          option
            .setName("year")
            .setDescription(
              "The year summary you'd like to see. Default current year"
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("current")
        .setDescription("Wordle Summary of this month")
    ),
  async execute(interaction) {
    const hasRole = interaction.member.roles.cache.some(
      (role) => role.name === "competitive"
    );
    if (!hasRole) {
      await interaction.reply(
        'You did not consent to store your game data! Give yourself the role "competitive"'
      );
      return;
    }

    if (interaction.options.getSubcommand() === "current") {
      const result = await getWordle(interaction.user.id);
      console.log(result);
      let data = [0, 0, 0, 0, 0, 0, 0];

      result.forEach((row) => {
        if (row.score == "X") {
          data[0] += 1;
        } else {
          const i = Number(row.score);
          data[i] += 1;
        }
      });

      const chart = new QuickChart();

      chart
        .setConfig({
          type: "bar",
          data: {
            labels: ["X", "1", "2", "3", "4", "5", "6"],
            datasets: [{ label: "Count", data: data }],
          },
          options: {
            scales: {
              yAxis: {
                min: 0,
              },
            },
          },
        })
        .setWidth(800)
        .setHeight(400);

      const chartEmbed = {
        title: interaction.user.username + "'s Wordle Summary this Month",
        description: "Here's a chart that I generated",
        image: {
          url: chart.getUrl(),
        },
      };
      console.log(chartEmbed);
      await interaction.reply({ embeds: [chartEmbed] });
    }
    if (interaction.options.getSubcommand() === "summary") {
      const year =
        interaction.options.getString("year") ||
        new Date().getFullYear().toString();
      const result = await getWordleSum(interaction.user.id, year);
      console.log(result);
      let data = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];

      result.forEach((row) => {
        if (row.score == "X") {
          data[0][row.month - 1] = row.count;
        } else {
          const i = Number(row.score);
          data[i][row.month - 1] = row.count;
        }
      });

      const chart = new QuickChart();

      chart
        .setConfig({
          type: "bar",
          data: {
            labels: months,
            datasets: [
              { label: "1", data: data[1] },
              { label: "2", data: data[2] },
              { label: "3", data: data[3] },
              { label: "4", data: data[4] },
              { label: "5", data: data[5] },
              { label: "6", data: data[6] },
              { label: "Failed", data: data[0] },
            ],
          },
          options: {
            scales: {
              yAxis: {
                min: 0,
              },
            },
          },
        })
        .setWidth(800)
        .setHeight(400);

      const chartEmbed = {
        title: interaction.user.username + "'s Wordle Summary of " + year,
        description: "Here's a chart that I generated",
        image: {
          url: chart.getUrl(),
        },
      };
      console.log(chartEmbed);
      await interaction.reply({ embeds: [chartEmbed] });
    }
  },
});

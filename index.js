import "dotenv/config";
import { Client, Events, GatewayIntentBits, MessageFlags } from "discord.js";
import { insertWordle } from "./server/wordle.js";
import { insertConn } from "./server/connections.js";
import { insertAngle } from "./server/angle.js";
import { insertColorfle } from "./server/colors.js";
import { insertPip } from "./server/pips.js";
import { commands } from "./commands.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = commands;

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

client.on(Events.MessageCreate, (message) => {
  const hasRole = message.member.roles.cache.some(
    (role) => role.name === "competitive"
  );
  if (message.author.bot || !hasRole) return;

  const msg = message.content.replace(",", "");

  let wordles = [...msg.matchAll(/Wordle [0-9]+ [X1-6]\/6/g)];
  let connections = [
    ...msg.matchAll(
      /Connections\nPuzzle #[0-9]+\n(([🟩🟨🟪🟦]{8})\n)*[🟩🟨🟪🟦]{8}/g
    ),
  ];
  let angles = [...msg.matchAll(/Angle.*\n.*off/g)];
  let colors = [...msg.matchAll(/Colorfle(.*\n)+?.*%/g)];
  let pips = [...msg.matchAll(/Pips.*\n.*/g)];

  if (
    wordles.length == 0 &&
    connections.length == 0 &&
    angles.length == 0 &&
    colors.length == 0 &&
    pips.length == 0
  )
    return;

  wordles.forEach((wordle) => {
    let items = wordle[0].split(" ");
    let score = items[2].slice(0, 1);
    let puzzle = items[1];
    insertWordle(message.author.id, puzzle, score);
  });

  connections.forEach((conn) => {
    let yellow = conn[0].includes("🟨🟨🟨🟨");
    let green = conn[0].includes("🟩🟩🟩🟩");
    let blue = conn[0].includes("🟦🟦🟦🟦");
    let purple = conn[0].includes("🟪🟪🟪🟪");
    let puzzle = conn[0].match(/[0-9]+/g)[0];
    insertConn(message.author.id, puzzle, yellow, green, blue, purple);
  });

  angles.forEach((angle) => {
    let items = angle[0].split(" ");
    let score = items[2].slice(0, 1);
    let puzzle = items[1].slice(1);
    let dist = null;
    if (score != "X") dist = angle[0].match(/[0-9]*(?=°)/g)[0] || null;
    insertAngle(message.author.id, puzzle, score, dist);
  });

  colors.forEach((color) => {
    let acc = color[0].match(/[0-9]*\.?[0-9]*(?=%)/g)[0];
    let items = color[0].split(" ");
    let puzzle = items[1];
    let mode = "Normal";
    let score;
    if (items[2].includes("Paint")) {
      mode = "Paint";
      score = items[4].slice(0, 1);
    } else if (items[2].includes("Hard")) {
      mode = "Hard";
      score = items[4].slice(0, 1);
    } else {
      score = items[2].slice(0, 1);
    }
    insertColorfle(message.author.id, puzzle, mode, score, acc);
  });

  pips.forEach((pip) => {
    let cookie = pip[0].includes("🍪");
    let time = pip[0].match(/[0-9]+:[0-9]{2}/g)[0];
    let items = pip[0].split(" ");
    let puzzle = items[1].slice(1);
    let mode = items[2];
    insertPip(message.author.id, puzzle, mode, time, cookie);
  });

  message.react("💾");
});

client.login(process.env.TOKEN);

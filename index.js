import { Client, Events, GatewayIntentBits }from 'discord.js';
import insertWordle from'./server/wordle.js';
import 'dotenv/config';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent
	]
});

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});


// Wordle 1,560 4/6

// ⬛⬛🟨⬛⬛
// 🟨🟨⬛⬛⬛
// ⬛🟩🟩⬛🟨
// 🟩🟩🟩🟩🟩
client.on(Events.MessageCreate, message => {
	const hasRole = message.member.roles.cache.some(role => role.name === 'competitive');
    if (message.author.bot || !hasRole) return;
	
	console.log(message.content);

	let index = message.content.indexOf("Wordle");
	if(index >= 0) {
		let subStr = message.content.substring(index).split(" ");
		if(subStr.length <= 2) return;
		console.log(subStr[2].slice(0,1));
		insertWordle(message.author.id, subStr[2].slice(0,1));
	}
});

client.login(process.env.TOKEN);

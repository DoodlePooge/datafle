const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wordle data')
		.setDescription('Get\'s wordle stats'),
	async execute(interaction) {
		await interaction.reply('Pong!');
    	console.log(member);
	},
};
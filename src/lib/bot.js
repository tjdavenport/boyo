const log = require('./log');
const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => log.bot('boyo bot ready'));

client.on('message', async msg => {
  console.log(msg.guild.id);
});

module.exports = client;

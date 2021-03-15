const http = require('http');
const EventEmitter = require('eventemitter2');
const Discord = require('discord.js');
const discord = require('./src/__mocks__/discord');

let startId = 0;
const id = () => String((Date.now() + startId++) * 1111);

(async () => {
  await discord.start(1557)

  Object.assign(Discord.Client.prototype, EventEmitter.prototype);

  const client = new Discord.Client({
    http: {
      api: 'http://localhost:1557/api',
      agent: new http.Agent({keepAlive: true}),
    }
  });
  client.token = 'foobarbaz123';

  const guild = new Discord.Guild(client, {
    id: id(),
    name: 'home of the foo bars'
  });

  client.guilds.cache.set(guild.id, guild);

  const channel = await guild.channels.create('foo-bar');
})()

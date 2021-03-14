const https = require('https');
const EventEmitter = require('eventemitter2');
const {Guild, Client} = require('discord.js');
const discord = require('./src/__mocks__/discord');

let startId = 0;
const id = () => String((Date.now() + startId++) * 1111);

(async () => {
  await discord.start(1557)
  Object.assign(Client.prototype, EventEmitter.prototype);

  const client = new Client({
    http: {api: 'https://localhost:1557/api'}
  });
  client.token = 'foobarbaz1234';


  const guild = new Guild(client, {
    id: id(),
    name: 'home of the foo bars'
  });

  guild.channels.create('foo-bar');
})()

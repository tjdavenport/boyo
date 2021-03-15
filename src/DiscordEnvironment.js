const http = require('http');
const faker = require('faker');
const bot = require('./lib/bot');
const db = require('./__mocks__/db');
const Discord = require('discord.js');
const config = require('./__mocks__/config');
const EventEmitter = require('eventemitter2');
const socketClient = require('socket.io-client');
const NodeEnvironment = require('jest-environment-node');

class PlasticClient extends Discord.Client {
  constructor(options = {}) {
    super({
      http: {
        api: 'http://localhost:1557/api',
        agent: new http.Agent({keepAlive: true}),
      }
    });
    this.startId = 0;
    this.token = 'boyo12345abcd';
  }
  get id() {
    return String((Date.now() + this.startId++) * 1111);
  }
  msg = async () => {
    const guild = new Discord.Guild(this, {
      id: this.id,
      name: 'home of the foo bars'
    });
    guild.roles.cache.set(guild.id, {id: guild.id, name: '@everyone'});
    this.guilds.cache.set(guild.id, guild);

    const user = new Discord.User(this, {
      id: this.id,
      bot: false,
      username: faker.internet.userName(),
      discriminator: faker.random.number({min: 1000, max: 9999}),
      system: false,
      locale: 'en',
    });
    const member = new Discord.GuildMember(this, {
      user,
    }, guild);
    guild.members.cache.set(member.id, member)


    const general = await guild.channels.create('general');
    const message = new Discord.Message(this, {
      author: user,
      pinned: false,
    }, general);

    return {
      guild,
      user,
      channel: general,
      member,
      send: msg => this.emitAsync('message', new Discord.Message(this, {
        author: member,
        member,
        pinned: false,
        tts: false,
        ...msg
      }, msg.channel || general))
    };
  }
}

Object.assign(PlasticClient.prototype, EventEmitter.prototype);

class DiscordEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
  }
  async setup() {
    await super.setup();
    this.global.client = new PlasticClient();
    this.global.socket = socketClient('http://localhost:1227');
    await bot(config, db.models(), this.global.client, this.global.socket);
  }
  async teardown() {
    this.global.socket.disconnect();
    await super.teardown();
  }
  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = DiscordEnvironment;

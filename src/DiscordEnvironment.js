const bot = require('./lib/bot');
const db = require('./__mocks__/db');
const config = require('./__mocks__/config');
const EventEmitter = require('eventemitter2');
const socketClient = require('socket.io-client');
const NodeEnvironment = require('jest-environment-node');

class DiscordEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
  }
  async setup() {
    await super.setup();
    this.global.client = new EventEmitter();
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

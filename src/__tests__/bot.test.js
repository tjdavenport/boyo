/**
 * @jest-environment node
 */
const db = require('db');
const bot = require('../lib/bot');
const EventEmitter = require('events');
const httpCustomer = require('httpCustomer');
const constants = require('../lib/constants');
const socketClient = require('socket.io-client');

const mockMsg = guildId => ({roleIds = [], content, onReply = () => {}}) => ({
  reply: msg => onReply(msg),
  content,
  member: {
    guild: {id: guildId},
    roles: {
      cache: {
        keyArray: () => roleIds
      }
    }
  },
})

describe('discord bot client', () => {
  it('supports console dayz server management', async () => {
    const client = new EventEmitter();
    const customer = httpCustomer();
    const socket = socketClient('http://localhost:1227');
    const guildId = '12345';
    const msg = mockMsg(guildId);

    await bot(db.models(), client, socket);
    await customer.get('/login');
    await customer.get(`/guilds/${guildId}/add-service/nitrado`);

    for (const key of Object.keys(constants.categories['nitrado-dayz'].botCommands)) {
      customer.patch(`/api/guilds/${guildId}/attached-bot-command`, {
        key, config: {serviceId: '54321', roleIds: [23456, 34567]}
      });
      await new Promise(resolve => socket.once('guild-bust', bustedGuildId => {
        expect(bustedGuildId).toBe(guildId);
        resolve();
      }));
    }

    await new Promise(resolve => client.emit('message', msg({
      roleIds: [23456],
      content: '!help',
      onReply: reply => {
        for (const key of Object.keys(constants.categories['nitrado-dayz'].botCommands)) {
          expect(reply).toContain(key);
          resolve();
        }
      }
    })));

    const noReply = jest.fn(() => {});
    client.emit('message', msg({
      roleIds: [999999999],
      content: '!help',
      onReply: noReply
    }));

    expect(noReply).not.toHaveBeenCalled();
  });
});

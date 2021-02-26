/**
 * @jest-environment ./src/DiscordEnvironment
 */
const httpCustomer = require('httpCustomer');
const constants = require('../lib/constants');

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
    const customer = httpCustomer();
    const guildId = '12345';
    const msg = mockMsg(guildId);

    await customer.get('/login');
    await customer.get(`/guilds/${guildId}/add-service/nitrado`);

    global.client.emit('message', msg({
      roleIds: [],
      content: 'hello everyone',
    }));

    for (const key of Object.keys(constants.categories['nitrado-dayz'].botCommands)) {
      customer.patch(`/api/guilds/${guildId}/attached-bot-command`, {
        key, config: {serviceId: '54321', roleIds: [23456, 34567]}
      });
      await new Promise(resolve => socket.once('guild-bust', bustedGuildId => {
        expect(bustedGuildId).toBe(guildId);
        resolve();
      }));
    }

    const noReply = jest.fn(() => {});
    global.client.emit('message', msg({
      roleIds: [999999999],
      content: '!help',
      onReply: noReply
    }));
    expect(noReply).not.toHaveBeenCalled();

    await new Promise(resolve => {
      global.client.emit('message', msg({
        roleIds: [23456],
        content: '!nitrado-dayz-restart',
        onReply: reply => {
          expect(reply).toContain('restarting');
          resolve();
        }
      }));
    });

    await customer.get(`/api/guilds/${guildId}/nitrado/services/54321/logs`)
      .then(({data}) => {
        expect(data.data.logs.map(({message}) => message)).toContain('Server restarted.');
      });

    await new Promise(resolve => global.client.emit('message', msg({
      roleIds: [23456],
      content: '!help',
      onReply: reply => {
        for (const key of Object.keys(constants.categories['nitrado-dayz'].botCommands)) {
          expect(reply).toContain(key);
        }
        resolve();
      }
    })));
  });
});

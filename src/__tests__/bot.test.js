/**
 * @jest-environment ./src/DiscordEnvironment
 */
const mockMsg = require('msg');
const httpCustomer = require('httpCustomer');
const constants = require('../lib/constants');

describe('discord bot client', () => {
  describe('auto factions', () => {
    it('supports creating a faction', async () => {
      const customer = httpCustomer();
      const guildId = '54321';
      const msg = mockMsg(guildId);

      await customer.get('/login');

      customer.patch(`/api/guilds/${guildId}/attached-bot-command`, {
        key: 'create-faction', config: {}
      });
      await new Promise(resolve => global.socket.once('guild-bust', bustedGuildId => {
        expect(bustedGuildId).toBe(guildId);
        resolve();
      }));

      await global.client.emitAsync('message', msg({
        content: '!help',
      })).then(([handled]) => {
        expect(handled.mocked.replies[0]).toContain('create-faction');
      });

      const memberId = '999888777666';
      await global.client.emitAsync('message', msg({
        member: {id: memberId},
        content: '!create-faction',
      })).then(([handled]) => {
        expect(handled.guild.roles.cache.array().map(({name}) => name)).toContain('new-faction');
        expect(handled.guild.roles.cache.array().map(({id}) => id)).toContain(handled.member.roles.cache.keyArray()[0]);
        expect(handled.guild.channels.cache.array()[0].name).toBe('new-faction');
        expect(handled.guild.channels.cache.array()[0].mocked.messages[0]).toContain(`<@${memberId}>`);
      });

      await global.client.emitAsync('message', msg({
        member: {id: memberId},
        content: '!create-faction',
      })).then(([handled]) => {
        expect(handled.member.roles.cache.keyArray().length).toBe(1);
        expect(handled.mocked.replies[0]).toContain('already in a faction');
      });
    });
  });

  it('supports console dayz server management', async () => {
    const customer = httpCustomer();
    const guildId = '12345';
    const msg = mockMsg(guildId);

    await customer.get('/login');
    await customer.get(`/guilds/${guildId}/add-service/nitrado`);

    global.client.emit('message', msg({
      content: 'hello everyone',
    }));

    for (const key of Object.keys(constants.categories['nitrado-dayz'].botCommands)) {
      customer.patch(`/api/guilds/${guildId}/attached-bot-command`, {
        key, config: {serviceId: '54321', roleIds: [23456, 34567]}
      });
      await new Promise(resolve => global.socket.once('guild-bust', bustedGuildId => {
        expect(bustedGuildId).toBe(guildId);
        resolve();
      }));
    }

    await global.client.emitAsync('message', msg({
      content: '!help',
    })).then(([handled]) => {
      expect(handled.mocked.replies.length).toBe(0);
    });

    await global.client.emitAsync('message', msg({
      member: {roles: {_roles_: [{id: 23456}]}},
      content: '!nitrado-dayz-restart',
    })).then(([handled]) => {
      expect(handled.mocked.replies[0]).toContain('restarting');
    });

    await customer.get(`/api/guilds/${guildId}/nitrado/services/54321/logs`)
      .then(({data}) => {
        expect(data.data.logs.map(({message}) => message)).toContain('Server restarted.');
      });

    await global.client.emitAsync('message', msg({
      member: {roles: {_roles_: [{id: 23456}]}},
      content: '!help',
      onReply: reply => {
        resolve();
      }
    })).then(([handled]) => {
      for (const key of Object.keys(constants.categories['nitrado-dayz'].botCommands)) {
        expect(handled.mocked.replies[0]).toContain(key);
      }
    });
  });
});

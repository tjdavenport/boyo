/**
 * @jest-environment ./src/DiscordEnvironment
 */
const httpCustomer = require('httpCustomer');
const constants = require('../lib/constants');

describe('discord bot client', () => {
  /*describe('auto factions', () => {
    it('supports creating a faction', async () => {
      const customer = httpCustomer();
      const guildId = '54321';
      const msg = mockMsg(guildId);

      await customer.get('/login');

      customer.patch(`/api/guilds/${guildId}/attached-bot-command`, {
        key: 'faction-create', config: {}
      });
      await new Promise(resolve => global.client.once('guild-busted', bustedGuildId => {
        expect(bustedGuildId).toBe(guildId);
        resolve();
      }));

      await global.client.emitAsync('message', msg({
        content: '!help',
      })).then(([handled]) => {
        expect(handled.mocked.replies[0]).toContain('faction-create');
      });

      const memberId = '999888777666';
      const factionChannel = {};
      await global.client.emitAsync('message', msg({
        member: {id: memberId},
        content: '!faction-create',
      })).then(([handled]) => {
        factionChannel.id = handled.guild.channels.cache.array()[0].id;
        factionChannel.name = handled.guild.channels.cache.array()[0].name;
        expect(handled.guild.roles.cache.array().map(({name}) => name)).toContain('new-faction');
        expect(handled.guild.roles.cache.array().map(({id}) => id)).toContain(handled.member.roles.cache.keyArray()[0]);
        expect(handled.guild.channels.cache.array()[0].name).toBe('new-faction');
        expect(handled.guild.channels.cache.array()[0].mocked.messages[0]).toContain(`<@${memberId}>`);
      });

      await global.client.emitAsync('message', msg({
        member: {id: memberId},
        content: '!faction-create',
      })).then(([handled]) => {
        expect(handled.member.roles.cache.keyArray().length).toBe(1);
        expect(handled.mocked.replies[0]).toContain('already in a faction');
      });

      await global.client.emitAsync('message', msg({
        channel: factionChannel,
        member: {id: memberId},
        content: 'wrong name whoops',
      })).then(([handled]) => {
        expect(handled.mocked.replies[0]).toContain('"wrong name whoops"? Respond "yes"');
      });

      await global.client.emitAsync('message', msg({
        channel: factionChannel,
        member: {id: memberId},
        content: 'no',
      })).then(([handled]) => {
        expect(handled.mocked.replies[0]).toContain('what would you like to call your faction?');
      });

      await global.client.emitAsync('message', msg({
        channel: factionChannel,
        member: {id: memberId},
        content: 'foobar baz',
      })).then(([handled]) => {
        expect(handled.mocked.replies[0]).toContain('"foobar baz"? Respond "yes"');
      });

      await global.client.emitAsync('message', msg(guild => {
        return {
          channel: guild.channels.cache.get(factionChannel.id),
          member: {id: memberId},
          content: 'yes',
        };
      })).then(([handled]) => {
        expect(handled.mocked.replies[0]).toContain('what color would you like');
        expect(handled.mocked.replies[0]).toContain('Available colors:');
        expect(handled.member.roles.cache.find(({name}) => name === 'foobar baz')).toBeTruthy();
      });

      await global.client.emitAsync('message', msg(guild => {
        return {
          channel: guild.channels.cache.get(factionChannel.id),
          member: {id: memberId},
          content: 'shit',
        };
      })).then(([handled]) => {
        expect(handled.mocked.replies[0]).toContain('Available colors:');
      });

      await global.client.emitAsync('message', msg(guild => {
        return {
          channel: guild.channels.cache.get(factionChannel.id),
          member: {id: memberId},
          content: 'green',
        };
      })).then(([handled]) => {
        expect(handled.mocked.replies[0]).toContain('are you sure you want your faction color to be "green"?');
      });

      await global.client.emitAsync('message', msg(guild => {
        return {
          channel: guild.channels.cache.get(factionChannel.id),
          member: {id: memberId},
          content: 'no',
        };
      })).then(([handled]) => {
        expect(handled.mocked.replies[0]).toContain('Available colors:');
      });

      await global.client.emitAsync('message', msg(guild => {
        return {
          channel: guild.channels.cache.get(factionChannel.id),
          member: {id: memberId},
          content: 'blue',
        };
      })).then(([handled]) => {
        expect(handled.mocked.replies[0]).toContain('are you sure you want your faction color to be "blue"?');
      });

      await global.client.emitAsync('message', msg(guild => {
        return {
          channel: guild.channels.cache.get(factionChannel.id),
          member: {id: memberId},
          content: 'yes',
        };
      })).then(([handled]) => {
        expect(handled.member.roles.cache.array()[0].color).toBe('BLUE');
        expect(handled.mocked.replies[0]).toContain('your faction has been setup!');
      });
    });
    it('supports inviting other members to a faction', async () => {
      const customer = httpCustomer();
      const guildId = '999888777';
      const msg = mockMsg(guildId);

      await customer.get('/login');

      for (const key of ['faction-create', 'faction-invite']) {
        customer.patch(`/api/guilds/${guildId}/attached-bot-command`, {
          key, config: {}
        });
        await new Promise(resolve => global.client.once('guild-busted', bustedGuildId => {
          expect(bustedGuildId).toBe(guildId);
          resolve();
        }));
      }

      await global.client.emitAsync('message', msg({content: '!faction-invite'})).then(([handled]) => {
        expect(handled.mocked.replies[0]).toContain('you\'re not a faction leader!');
      });

      const leader = {id: '9199612298'};
      await global.client.emitAsync('message', msg({content: '!faction-create', member: leader}));

      const factionMsg = content => global.client.emitAsync('message', msg(guild => {
        return {content, member: leader, channel: guild.channels.cache.array()[0]};
      }));
      await factionMsg('Boyos in the Hood');
      await factionMsg('yes');
      await factionMsg('black');
      await factionMsg('yes').then(([handled]) => {
        expect(handled.guild.channels.cache.array()[0].name).toBe('Boyos in the Hood');
      });
    });
  });*/

  it('supports console dayz server management', async () => {
    const customer = httpCustomer();
    const msg = await client.msg();

    await customer.get('/login');
    await customer.get(`/guilds/${msg.guild.id}/add-service/nitrado`);

    /*global.client.emit('message', msg({
      content: 'hello everyone',
    }));

    for (const key of Object.keys(constants.categories['nitrado-dayz'].botCommands)) {
      customer.patch(`/api/guilds/${guildId}/attached-bot-command`, {
        key, config: {serviceId: '54321', roleIds: [23456, 34567]}
      });
      await new Promise(resolve => global.client.once('guild-busted', bustedGuildId => {
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
    });*/
  });
});

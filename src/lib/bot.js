const axios = require('axios');
const constants = require('./constants');

const cache = {
  commands: {},
  links: {},
  autoFactions: {},
};

const ensureAutoFactionsCached = async (models, guildId, bust = false) => {
  if (!cache.autoFactions[guildId] || bust) {
    const autoFactions = await models.AutoFaction.findAll({
      where: {guildId}
    });
    cache.autoFactions[guildId] = autoFactions.reduce((map, autoFaction) => {
      map[autoFaction.channelId] = autoFaction;
      return map;
    }, {});
  }
};

const ensureGuildCached = async (models, guildId, bust = false) => {
  if (!cache.commands[guildId] || bust) {
    const attachedBotCommands = await models.AttachedBotCommand.findAll({
      where: {guildId}
    });
    cache.commands[guildId] = attachedBotCommands.reduce((map, attachedCommand) => {
      map[attachedCommand.key] = attachedCommand.toJSON();
      return map;
    }, {});
  }
  if (!cache.links[guildId] || bust) {
    const oAuth2Links = await models.OAuth2Link.findAll({
      where: {guildId}
    });
    cache.links[guildId] = oAuth2Links.reduce((map, oAuth2Link) => {
      map[oAuth2Link.type] = oAuth2Link.toJSON();
      return map;
    }, {});
  }
};

const memberCommands = member => {
  return Object.values(cache.commands[member.guild.id] || []).filter(command => {
    return !command.config.roleIds || ((command.config.roleIds.length > 0) && 
      command.config.roleIds.some(roleId => member.roles.cache.keyArray().includes(roleId)));
  });
};

const systemCommands = Object
  .keys(constants.categories)
  .map(categoryKey => ([Object.entries(constants.categories[categoryKey].botCommands), categoryKey]))
  .reduce(((systemCommandsMap, [botCommands, categoryKey]) => ({
    ...systemCommandsMap,
    ...Object.fromEntries(botCommands.map(([key, command]) => ([key, {...command, categoryKey}])))
  })), {});

const commandBodies = {
  'nitrado-dayz-restart': async (config, attachedCommand, oAuth2Links, msg, models) => {
    try {
      await axios.post(`${config.NITRADO_API_URI}/services/${attachedCommand.config.serviceId}/gameservers/restart`, null, {
        headers: {
          Authorization: `Bearer ${oAuth2Links['nitrado'].accessToken}`
        }
      });
      msg.reply('the DayZ server is restarting...');
    } catch (error) {
      console.error(error);
      msg.reply('error encountered while restarting DayZ server');
    }
  },
  'faction-invite': async (config, attachedCommand, oAuth2Links, msg, models) => {
    if (!Object.values(cache.autoFactions[msg.guild.id]).map(({leaderId}) => leaderId).includes(msg.member.id)) {
      return msg.reply('you\'re not a faction leader!');
    }
    await msg.react('U+1F44D');
    await msg.react('U+1F44E');
    await msg.channel.send('Thumbs up to accept invite, thumbs downt to decline.');
    return msg;
  },
  'faction-create': async (config, attachedCommand, oAuth2Links, msg, models) => {
    const guildFactionRoleIds = Object.values(cache.autoFactions[msg.guild.id]).map(({roleId}) => roleId);
    if (guildFactionRoleIds.find(roleId => msg.member.roles.cache.keyArray().includes(roleId))) {
      return msg.reply(`you're already in a faction!`);
    }

    const everyone = msg.guild.roles.cache.find(role => role.name === '@everyone');
    const boyo = msg.guild.roles.cache.find(role => (role.name === 'boyo.gg') && role.managed);
    const role = await msg.guild.roles.create({data: {
      name: 'new-faction', 
      hoist: true,
      color: 'GREY',
    }});
    await msg.member.roles.add(role.id);
    const channel = await msg.guild.channels.create('new-faction', {
      permissionOverwrites: [
        {type: 'role', id: everyone.id, deny: ['VIEW_CHANNEL']},
        {type: 'role', id: boyo.id, allow: ['VIEW_CHANNEL']},
        {type: 'role', id: role.id, allow: ['VIEW_CHANNEL']}
      ],
    });
    channel.send(`${msg.member.toString()}, it's time to setup your faction! What do you want to call it?`);

    const autoFaction = await models.AutoFaction.create({
      leaderId: msg.member.id,
      guildId: msg.guild.id,
      channelId: channel.id,
      roleId: role.id,
    });
    cache.autoFactions[msg.guild.id][channel.id] = autoFaction.toJSON();

    setTimeout(() => {
      channel.fetch(true).then(latestChannel => {
        if (channel.name === 'new-faction') {
          channel.delete().catch(error => console.error(error));
          autoFaction.detroy().catch(error => console.error(error));
          delete cache.autoFactions[msg.guild.id][channel.id];
        }
      });
    }, 300000);
  },
};

module.exports = async (config, models, client, bus, log = () => {}) => {
  try {
    bus.on('guild-bust', guildId => {
      ensureGuildCached(models, guildId, true).then(() => {
        log(`guild ${guildId} cache busted`);
        client.emit('guild-busted', guildId);
      });
    });

    client.on('ready', () => log('boyo bot ready'));

    client.on('messageReactionAdd', async (reaction, user) => {

    });

    client.on('message', async msg => {
      try {
        await ensureGuildCached(models, msg.member.guild.id);
        const availableCommands = memberCommands(msg.member);

        // handle help command
        if ((msg.content === '!help') && (availableCommands.length > 0)) {
          msg.reply(`henlo boyo! Here's some commands available to you;\n${availableCommands.map(command => {
            return `\`!${command.key}\` - ${systemCommands[command.key].description}`;
          }).join(`\n`)}`);
          return msg;
        }

        // handle faction setup for leaders
        if (cache.autoFactions[msg.guild.id]?.[msg.channel.id]) {
          const autoFaction = cache.autoFactions[msg.guild.id][msg.channel.id];
          const isLeaderMsg = autoFaction.leaderId === msg.member.id;

          // logic for faction color
          if (isLeaderMsg && autoFaction.awaitingColor) {
            if (constants.factionColors.includes(msg.content.toUpperCase())) {
              delete autoFaction.awaitingColor;
              autoFaction.pendingColor = msg.content.toUpperCase();
              msg.reply(`are you sure you want your faction color to be "${msg.content}"? Respond "yes" to confirm or "no" to use a different color.`);
              return msg;
            } else {
              msg.reply(`Available colors: ${constants.factionColors.join(', ')}`);
              return msg;
            }
            return msg;
          }
          if (isLeaderMsg && !autoFaction.awaitingColor && autoFaction.pendingColor) {
            if (msg.content.toLowerCase() === 'yes') {
              await msg.member.roles.cache.get(autoFaction.roleId).edit({color: autoFaction.pendingColor});
              delete autoFaction.pendingColor;
              msg.reply(`your faction has been setup!`);
              return msg;
            }
            if (msg.content.toLowerCase() === 'no') {
              delete autoFaction.pendingColor;
              msg.reply(`Available colors: ${constants.factionColors.join(', ')}`);
              autoFaction.awaitingColor = true;
              return msg;
            }
          }


          // logic for faction name
          if (isLeaderMsg && (msg.channel.name === 'new-faction') && !autoFaction.pendingName) {
            autoFaction.pendingName = msg.content;
            msg.reply(`are you sure you want to name your faction "${msg.content}"? Respond "yes" to confirm or "no" to use a different name.`);
            return msg;
          }
          if (isLeaderMsg && (msg.channel.name === 'new-faction') && autoFaction.pendingName) {
            if (msg.content.toLowerCase() === 'yes') {
              await msg.channel.setName(autoFaction.pendingName);
              await msg.member.roles.cache.get(autoFaction.roleId).setName(autoFaction.pendingName);
              delete autoFaction.pendingName;
              autoFaction.awaitingColor = true;
              msg.reply(`what color would you like your faction to be?\nAvailable colors: ${constants.factionColors.join(', ')}`);
            }

            if (msg.content.toLowerCase() === 'no') {
              delete autoFaction.pendingName;
              msg.reply('what would you like to call your faction?');
            }
            return msg;
          }
        }

        // handle commands
        if (msg.content.startsWith('!')) {
          for (const command of availableCommands) {
            if (msg.content.startsWith('!' + command.key)) {
              if (systemCommands[command.key].categoryKey === 'auto-factions') {
                await ensureAutoFactionsCached(models, msg.member.guild.id);
              }

              log(`running command ${command.key} for guild ${msg.member.guild.id}`);
              await commandBodies[command.key]?.(config, command, cache.links[msg.member.guild.id], msg, models);
              break;
            }
          }
        }

        return msg;
      } catch (error) {
        console.error(error);
      }
    });

    return client
  } catch (error) {
    console.error(error);
  }
};

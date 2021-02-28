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
    return !command.roleIds || ((command.roleIds.length > 0) && 
      command.roleIds.some(roleId => member.roles.cache.keyArray().includes(roleId)));
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
  'nitrado-dayz-restart': async (config, attachedCommand, oAuth2Links, msg) => {
    axios.post(`${config.NITRADO_API_URI}/services/${attachedCommand.config.serviceId}/gameservers/restart`, null, {
      headers: {
        Authorization: `Bearer ${oAuth2Links['nitrado'].accessToken}`
      }
    }).then(res => msg.reply('the DayZ server is restarting...'))
      .catch(error => {
        console.error(error);
        msg.reply('error encountered while restarting DayZ server');
      });
  },
};

module.exports = async (config, models, client, bus, log = () => {}) => {
  try {
    bus.on('guild-bust', guildId => {
      ensureGuildCached(models, guildId, true);
      log(`guild ${guildId} cache busted`);
    });

    client.on('ready', () => log('boyo bot ready'));
    client.on('message', async msg => {
      try {
        await ensureGuildCached(models, msg.member.guild.id);
        const availableCommands = memberCommands(msg.member);

        if ((msg.content === '!help') && (availableCommands.length > 0)) {
          return msg.reply(`henlo boyo! Here's some commands available to you;\n${availableCommands.map(command => {
            return `\`!${command.key}\` - ${systemCommands[command.key].description}`;
          }).join(`\n`)}`);
        }

        for (const command of availableCommands) {
          if (msg.content.startsWith('!' + command.key)) {
            if (systemCommands[command.key].categoryKey === 'auto-factions') {
              await ensureAutoFactionsCached(models, msg.member.guild.id);
            }

            log(`running command ${command.key} for guild ${msg.member.guild.id}`);
            await commandBodies[command.key]?.(config, command, cache.links[msg.member.guild.id], msg);
            break;
          }
        }
      } catch (error) {
        console.error(error);
      }
    });

    return client
  } catch (error) {
    console.error(error);
  }
};

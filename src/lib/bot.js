const log = require('./log');
const Discord = require('discord.js');
const constants = require('./constants');

module.exports = async (models) => {
  try {
    const attachedBotCommands = await models.AttachedBotCommand.findAll();
    const commands = attachedBotCommands.reduce((map, attachedCommand) => {
      !map[attachedCommand.guildId] && (map[attachedCommand.guildId] = {});
      map[attachedCommand.guildId][attachedCommand.key] = attachedCommand.toJSON();
      return map;
    }, {});

    const oAuth2Links = await models.OAuth2Link.findAll();
    const links = oAuth2Links.reduce((map, oAuth2Link) => {
      !map[oAuth2Link.guildId] && (map[oAuth2Link.guildId] = {});
      map[oAuth2Link.guildId][oAuth2Link.type] = oAuth2Link.toJSON();
      return map;
    }, {});

    const allCommands = Object
      .values(constants.categories)
      .map(({botCommands}) => botCommands)
      .reduce(((allCommandsMap, botCommands) => ({...allCommandsMap, ...botCommands})), {});

    const memberCommands = member => {
      return Object.values(commands[member.guild.id] || []).filter(command => {
        return !command.roleIds || ((command.roleIds.length > 0) && 
          command.roleIds.some(roleId => member.roles.cache.keyArray().includes(roleId)));
      });
    };

    const client = new Discord.Client();

    client.on('ready', () => log.bot('boyo bot ready'));
    client.on('message', async msg => {
      if (msg.content === '!help') {
        const commandsToExplain = memberCommands(msg.member);

        if (commandsToExplain.length > 0) {
          msg.reply(`Henlo boyo! Here's some commands available to you;\n${commandsToExplain.map(command => {
            return `\`!${command.key}\` - ${allCommands[command.key].description}`;
          }).join(`\n`)}`);
        }
      }
    });

    return client
  } catch (error) {
    console.error(error);
  }
};

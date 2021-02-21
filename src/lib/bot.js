const constants = require('./constants');

module.exports = async (models, client, log) => {
  try {
    const attachedBotCommands = await models.AttachedBotCommand.findAll();
    const commands = attachedBotCommands.reduce((map, attachedCommand) => {
      !map[attachedCommand.guildId] && (map[attachedCommand.guildId] = {});
      map[attachedCommand.guildId][attachedCommand.key] = attachedCommand.toJSON();
      return map;
    }, {});

    log('constructed attached commands map');

    const oAuth2Links = await models.OAuth2Link.findAll();
    const links = oAuth2Links.reduce((map, oAuth2Link) => {
      !map[oAuth2Link.guildId] && (map[oAuth2Link.guildId] = {});
      map[oAuth2Link.guildId][oAuth2Link.type] = oAuth2Link.toJSON();
      return map;
    }, {});

    log('constructed oAuth2 links map');

    const systemCommands = Object
      .values(constants.categories)
      .map(({botCommands}) => botCommands)
      .reduce(((systemCommandsMap, botCommands) => ({...systemCommandsMap, ...botCommands})), {});

    log('constructed system commands map');

    const memberCommands = member => {
      return Object.values(commands[member.guild.id] || []).filter(command => {
        return !command.roleIds || ((command.roleIds.length > 0) && 
          command.roleIds.some(roleId => member.roles.cache.keyArray().includes(roleId)));
      });
    };

    client.on('ready', () => log.bot('boyo bot ready'));
    client.on('message', async msg => {
      const availableCommands = memberCommands(msg.member);

      if ((msg.content === '!help') && (availableCommands.length > 0)) {
        msg.reply(`henlo boyo! Here's some commands available to you;\n${availableCommands.map(command => {
          return `\`!${command.key}\` - ${systemCommands[command.key].description}`;
        }).join(`\n`)}`);
      }
    });

    return client
  } catch (error) {
    console.error(error);
  }
};

let lastId = 1;

module.exports = guildId => ({memberId = '91836957238357', roleIds = [Symbol()], content, onReply = () => {}, onChannelCreate = () => {}, onMsg = () => {}}) => {
  const roles = {
    _roles_: [
      {
        name: '@everyone',
        id: lastId++,
      },
      {
        name: 'boyo.gg',
        managed: true,
        id: lastId++,
      },
    ],
    cache: {
      find: findFunc => roles._roles_.find(findFunc)
    }
  };

  const channels = {
    _channels_: [],
    cache: {
      find: findFunc => channels._channels_.find(findFunc)
    },
    create: (name, options = {}) => {
      return new Promise(resolve => {
        const id = lastId++;
        const channel = {
          send: msg => onMsg({channel, msg}),
          id,
          name,
          ...options,
          type: options.type || 'text',
        };
        channels._channels_.push(channel);
        onChannelCreate(channel);
        return resolve(channel);
      });
    },
  };

  const guild = {
    id: guildId,
    channels,
    roles,
  };

  return {
    reply: msg => onReply(msg),
    content,
    guild,
    member: {
      id: memberId,
      toString: () => `<@${memberId}>`,
      guild,
      roles: {
        cache: {
          keyArray: () => roleIds
        }
      }
    },
  };
};

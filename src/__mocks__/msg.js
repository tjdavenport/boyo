let lastId = 1;

module.exports = guildId => ({memberId = '91836957238357', roleIds = [Symbol()], content, onReply = () => {}, }) => {
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
      find: findFunc => roles._roles_.find(findFunc),
      array: () => roles._roles_
    }
  };

  const channels = {
    _channels_: [],
    cache: {
      find: findFunc => channels._channels_.find(findFunc),
      array: () => channels._channels_
    },
    create: (name, options = {}) => {
      return new Promise(resolve => {
        const id = lastId++;
        const messages = [];

        const channel = {
          mocked: {
            messages,
          },
          send: msg => messages.push(msg),
          id,
          name,
          ...options,
          type: options.type || 'text',
        };
        channels._channels_.push(channel);
        return resolve(channel);
      });
    },
  };

  const guild = {
    id: guildId,
    channels,
    roles,
  };

  const replies = [];

  return {
    mocked: {
      replies
    },
    reply: msg => replies.push(msg),
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

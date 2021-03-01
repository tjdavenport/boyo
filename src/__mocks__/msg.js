let lastId = 1;

const guilds = {};
const members = {};

module.exports = guildId => ({member = {}, content = ''}) => {
  !guilds[guildId] && (guilds[guildId] = {
    id: guildId,
    replies: [],
    roles: {
      _roles_: [
        {
          name: '@everyone',
          id: String(lastId++),
        },
        {
          name: 'boyo.gg',
          managed: true,
          id: String(lastId++),
        },
      ],
      create: (options = {data: {}}) => {
        return new Promise(resolve => {
          const id = String(lastId++);
          const role = {
            id,
            ...options.data
          };
          guilds[guildId].roles._roles_.push(role);
          resolve(role);
        });
      },
      cache: {
        find: findFunc => guilds[guildId].roles._roles_.find(findFunc),
        array: () => guilds[guildId].roles._roles_
      }
    },
    channels: {
      _channels_: [],
      cache: {
        find: findFunc => channels._channels_.find(findFunc),
        array: () => guilds[guildId].channels._channels_
      },
      create: (name, options = {}) => {
        return new Promise(resolve => {
          const id = String(lastId++);
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
          guilds[guildId].channels._channels_.push(channel);
          return resolve(channel);
        });
      },
    }
  });

  const memberId = member.id || String(lastId++);
  !members[memberId] && (members[memberId] = {
    id: String(lastId++),
    ...member,
    roles: {
      _roles_: [...((member.roles && member.roles._roles_) ? member.roles._roles_ : [] )],
      add: roleId => {
        members[memberId].roles._roles_.push({id: roleId});
        return Promise.resolve({id: roleId});
      },
      cache: {
        keyArray: () => members[memberId].roles._roles_.map(({id}) => id),
        array: () => members[memberId].roles._roles_,
      }
    },
    toString: () => `<@${members[memberId].id}>`,
    guild: guilds[guildId]
  });

  const replies = [];
  return {
    mocked: {
      replies
    },
    reply: msg => replies.push(msg),
    content,
    guild: guilds[guildId],
    member: members[memberId],
  };
};

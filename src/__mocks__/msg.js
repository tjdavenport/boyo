let lastId = 1;

const guilds = {};
const members = {};

module.exports = guildId => mockOptions => {
  const {member = {}, channel, content = ''} = (typeof mockOptions === 'function') ? mockOptions(guilds[guildId]) : mockOptions;

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
            ...options.data,
            edit: newValues => {
              return new Promise(resolve => {
                Object.entries(newValues).forEach(([key, value]) => role[key] = value);
                resolve(role);
              });
            },
          };
          guilds[guildId].roles._roles_.push(role);
          resolve(role);
        });
      },
      cache: {
        find: findFunc => guilds[guildId].roles._roles_.find(findFunc),
        array: () => guilds[guildId].roles._roles_,
        get: needle => guilds[guildId].roles._roles_.find(({id}) => id === needle)
      }
    },
    channels: {
      _channels_: [],
      cache: {
        find: findFunc => channels._channels_.find(findFunc),
        array: () => guilds[guildId].channels._channels_,
        get: needle => guilds[guildId].channels._channels_.find(({id}) => id === needle)
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
            setName: newName => new Promise(resolve => {
              channel.name = newName;
              return resolve(channel);
            }),
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
        const role = {
          id: roleId,
          setName: newName => new Promise(resolve => {
            role.name = newName;
            return resolve(channel);
          }),
          edit: newValues => {
            return new Promise(resolve => {
              Object.entries(newValues).forEach(([key, value]) => role[key] = value);
              resolve(role);
            });
          },
        };
        guilds[guildId].roles._roles_.push(role);
        members[memberId].roles._roles_.push(role);
        return Promise.resolve(role);
      },
      cache: {
        find: findFunc => members[memberId].roles._roles_.find(findFunc),
        keyArray: () => members[memberId].roles._roles_.map(({id}) => id),
        array: () => members[memberId].roles._roles_,
        get: needle => members[memberId].roles._roles_.find(({id}) => id === needle)
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
    channel: channel || {id: String(lastId++)},
    content,
    guild: guilds[guildId],
    member: members[memberId],
  };
};

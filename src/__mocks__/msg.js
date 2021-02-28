module.exports = guildId => ({roleIds = [Symbol()], content, onReply = () => {}}) => {
  const channels = [];

  return {
    reply: msg => onReply(msg),
    content,
    member: {
      guild: {
        id: guildId,
        channels: {
          create: (name, options) => {

          },
        }
      },
      roles: {
        cache: {
          keyArray: () => roleIds
        }
      }
    },
  };
};

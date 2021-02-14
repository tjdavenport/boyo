const dPerms = {
  readMessageHistory: 0x00010000,
  sendMessages: 0x00000800,
};

exports.categories = {
  'nitrado-dayz': {
    name: 'Nitrado DayZ',
    botCommands: {
      'nitrado-dayz-restart': {
        description: 'Shutdown then start the Nitrado DayZ server.',
        discordPerms: [dPerms.readMessageHistory, dPerms.sendMessages],
        oAuth2Links: ['nitrado'],
      },
      'nitrado-dayz-shutdown': {
        description: 'Shutdown the Nitrado DayZ server.',
        discordPerms: [dPerms.readMessageHistory, dPerms.sendMessages],
        oAuth2Links: ['nitrado'],
      },
      'nitrado-dayz-start': {
        description: 'Start the Nitrado DayZ server.',
        discordPerms: [dPerms.readMessageHistory, dPerms.sendMessages],
        oAuth2Links: ['nitrado'],
      },
    }
  }
};

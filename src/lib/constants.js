const dPerms = {
  addReactions: 0x00000040,
  readMessageHistory: 0x00010000,
  sendMessages: 0x00000800,

  manageRoles: 0x10000000,

  manageChannels: 0x00000010,
  viewChannel: 0x00000400,
};

exports.categories = {
  'auto-factions': {
    name: 'Auto Factions',
    botCommands: {
      'create-faction': {
        description: 'Create a private faction channel & custom role',
        discordPerms: [dPerms.readMessageHistory, dPerms.sendMessages, dPerms.addReactions, dPerms.manageRoles, dPerms.manageChannels, dPerms.viewChannel],
        oAuth2Links: [],
      },
      'faction-invite': {
        description: 'Invite someone to your faction.',
        discordPerms: [dPerms.readMessageHistory, dPerms.sendMessages, dPerms.addReactions, dPerms.manageRoles, dPerms.manageChannels, dPerms.viewChannel],
        oAuth2Links: [],
      },
      'faction-kick': {
        description: 'Kick someone from your faction.',
        discordPerms: [dPerms.readMessageHistory, dPerms.sendMessages, dPerms.addReactions, dPerms.manageRoles, dPerms.manageChannels, dPerms.viewChannel],
        oAuth2Links: [],
      },
      'faction-disband': {
        description: 'Kick everyone from your faction and disband it.',
        discordPerms: [dPerms.readMessageHistory, dPerms.sendMessages, dPerms.addReactions, dPerms.manageRoles, dPerms.manageChannels, dPerms.viewChannel],
        oAuth2Links: [],
      },
    }
  },
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

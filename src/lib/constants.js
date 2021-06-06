const dPerms = {
  addReactions: 0x00000040,
  readMessageHistory: 0x00010000,
  sendMessages: 0x00000800,

  manageRoles: 0x10000000,

  manageChannels: 0x00000010,
  viewChannel: 0x00000400,
};

exports.factionColors = ['BLACK', 'BLUE', 'GREEN', 'ORANGE', 'PINK', 'RED', 'YELLOW', 'WHITE'];
exports.testGuildId = '695309211608940674';
exports.applicationId = '752638531972890726';

exports.services = {
  'nitrado-dayz-management': {
    name: 'Nitrado DayZ Management',
    requiredPerms: [
      dPerms.readMessageHistory, 
      dPerms.sendMessages, 
      dPerms.addReactions, 
      dPerms.manageRoles, 
      dPerms.manageChannels, 
      dPerms.viewChannel
    ],
    oAuth2Links: ['nitrado'],
    slashCommands: [
      {
        name: 'nitrado-dayz-restart',
        description: 'Shutdown then start the Nitrado DayZ server.',
      },
      {
        name: 'nitrado-dayz-shutdown',
        description: 'Shutdown the Nitrado DayZ server.',
      },
      {
        name: 'nitrado-dayz-start',
        description: 'Start the Nitrado DayZ server.',
      }
    ]
  }
};

/*exports.categories = {
  'auto-factions': {
    name: 'Auto Factions',
    botCommands: {
      'faction-create': {
        description: 'Create a private faction channel & custom role',
        oAuth2Links: [],
      },
      'faction-invite': {
        description: 'Invite someone to your faction by pinging them. E.g !faction-invite @boyo.gg',
        discordPerms: [dPerms.readMessageHistory, dPerms.sendMessages, dPerms.addReactions, dPerms.manageRoles, dPerms.manageChannels, dPerms.viewChannel],
        oAuth2Links: [],
      },
      'faction-kick': {
        description: 'Kick someone from your faction by pinging them. E.g !faction-kick @boyo.gg',
        discordPerms: [dPerms.readMessageHistory, dPerms.sendMessages, dPerms.addReactions, dPerms.manageRoles, dPerms.manageChannels, dPerms.viewChannel],
        oAuth2Links: [],
      },
      'faction-quit': {
        description: 'Leave your current faction.',
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
};*/

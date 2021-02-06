module.exports = [
  {
    name: 'Console DayZ',
    slug: 'console-dayz',
    botServices: [
      {
        name: 'Server Maintenance',
        slug: 'server-maintenance',
        botCommands: [
          {
            slug: 'restart',
            initiator: '!dayz-restart',
          },
          {
            slug: 'shutdown',
            initiator: '!dayz-shutdown',
          },
          {
            slug: 'start',
            initiator: '!dayz-start',
          },
        ],
      },
      {
        name: 'Server Moderation',
        slug: 'server-moderation',
        botCommands: [

        ],
      }
    ]
  }
];

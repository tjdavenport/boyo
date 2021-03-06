require('dotenv').config();
const express = require('express');
const bot = require('./src/lib/bot');
const app = require('./src/lib/app');
const log = require('./src/lib/log');
const Discord = require('discord.js');
const {program} = require('commander');
const socketServer = require('socket.io');
const socketClient = require('socket.io-client');
const register = require('@react-ssr/express/register');
const {sql, configure, models} = require('./src/lib/db');

configure(process.env);

(async () => {
  program
    .command('db:test-connection')
    .action(async () => {
      log.db('testing db connection');

      try {
        await sql().authenticate({logging: false});
        log.db('db connection active');
        await sql().close();
        process.exit();
      } catch (error) {
        log.db('db connection failed');
        console.error(error);
        process.exit();
      }
    });

  program
    .command('db:seed:tables')
    .action(async () => {
      await sql().sync({logging: false, force: true});
      log.db('tables seeded');
      await sql().close();
      process.exit();
    });

  program
    .command('db:seed:auto-factions <guildId>')
    .action(async guildId => {
      for (const key of ['faction-create', 'faction-invite']) {
        await models().AttachedBotCommand.create({
          key, guildId
        });
      }
      await sql().close();
      process.exit();
    });

  program
    .command('serve <port> <socketPort>')
    .action(async (port, socketPort) => {
      const boyo = express();
      boyo.set('config', process.env);
      boyo.set('log', log);
      boyo.set('bus', socketServer(socketPort));
      app(boyo);
      await register(boyo);
      await boyo.start(port);
      log.http(`http server listening on ${port}`);
      log.http(`socket server listening on ${socketPort}`);
    });

  program
    .command('bot:login')
    .action(async (socketPort) => {
      const client = new Discord.Client({
        partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
        ws: {intents: Discord.Intents.ALL},
      });

      const boyo = await bot(
        process.env,
        models(), 
        client, 
        socketClient(`http://localhost:${socketPort}`),
        log.bot
      );
      boyo.login(process.env.DISCORD_BOT_TOKEN);
    });

  await program.parseAsync();
})();

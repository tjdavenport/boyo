require('dotenv').config();
const express = require('express');
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
      for (const key of ['faction-create', 'faction-invite', 'faction-quit', 'faction-kick']) {
        await models().AttachedBotCommand.create({
          key, guildId
        });
      }
      await sql().close();
      process.exit();
    });

  program
    .command('serve <port>')
    .action(async (port) => {
      const boyo = express();
      boyo.set('config', process.env);
      boyo.set('log', log);
      app(boyo);
      await register(boyo);
      await boyo.start(port);
      log.http(`http server listening on ${port}`);
    });

  await program.parseAsync();
})();

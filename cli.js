require('dotenv').config();
const express = require('express');
const bot = require('./src/lib/bot');
const app = require('./src/lib/app');
const log = require('./src/lib/log');
const {sql, configure} = require('./src/lib/db');
const {program} = require('commander');
const register = require('@react-ssr/express/register');

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
    .command('serve <port>')
    .action(async port => {
      const boyo = express();
      boyo.set('config', process.env);
      boyo.set('log', log);
      app(boyo);
      await register(boyo);
      await boyo.start(port);
      log.http(`listening on ${port}`)
    });

  program
    .command('bot:login')
    .action(() => {
      bot.login(process.env.DISCORD_BOT_TOKEN);
    });

  await program.parseAsync();
})();

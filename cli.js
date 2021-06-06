require('dotenv').config();
const express = require('express');
const app = require('./src/lib/app');
const log = require('./src/lib/log');
const {program} = require('commander');
const {discord} = require('./src/lib/http');
const register = require('@react-ssr/express/register');
const {sql, configure, models} = require('./src/lib/db');
const {applicationId, testGuildId, services} = require('./src/lib/constants');

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
    .command('slash-commands:seed')
    .action(async () => {
      try {
        const res = await discord(process.env).post(
          `/applications/${applicationId}/guilds/${testGuildId}/commands`,
          services['nitrado-dayz-management'].slashCommands[0]
        );
        log.http('slash command seeded');
      } catch (error) {
        console.error(error.response.data);
        process.exit();
      }
    });

  program
    .command('slash-commands:list')
    .action(async () => {
      try {
        const res = await discord(process.env).get(`/applications/${applicationId}/guilds/${testGuildId}/commands`);
        console.table(res.data);
      } catch (error) {
        console.error(error.response.data);
        process.exit();
      }
    });

  program
    .command('slash-commands:clear')
    .action(async () => {
      try {
        const {data} = await discord(process.env).get(`/applications/${applicationId}/guilds/${testGuildId}/commands`);
        await Promise.all(data.map(({id}) => discord(process.env).delete(`/applications/${applicationId}/guilds/${testGuildId}/commands/${id}`)))
        log.http('slash commands cleared');
      } catch (error) {
        console.error(error.response.data);
        process.exit();
      }
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

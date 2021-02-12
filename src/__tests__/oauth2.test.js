/**
 * @jest-environment node
 */

require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const app = require('../lib/app');
const express = require('express');
const tough = require('tough-cookie');
const {sql, configure} = require('../lib/db');
const oAuth2App = require('../mocks/oAuth2App');
const discordApp = require('../mocks/discordApp');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;

const config = {
  ...process.env,
  DB_NAME: `${process.env.DB_NAME}_test`,
  DISCORD_AUTHORIZATION_URL: 'http://localhost:1447/discord/api/oauth2/authorize',
  DISCORD_TOKEN_URL: 'http://localhost:1447/discord/api/oauth2/token',
  DISCORD_API_URI: 'http://localhost:1557/api',
};
configure(config)

axiosCookieJarSupport(axios);
axios.defaults.jar = new tough.CookieJar();
axios.defaults.withCredentials = true;

describe('endopints involving oAuth2', () => {
  const servers = [];
  const boyo = express();

  beforeAll(async () => {
    await sql().sync({logging: false, force: true});

    boyo.set('config', config);
    boyo.set('log', {
      auth: msg => boyo.emit('log', msg)
    });
    boyo.use(cors());
    app(boyo);

    servers.push(await boyo.start(1337));
    servers.push(await oAuth2App().start(1447));
    servers.push(await discordApp().start(1557));
  });

  it('creates a user and authenticates with Discord', done => {
    boyo.on('log', msg => {
      (msg === 'user authenticated') && done();
    });
    axios.get('http://localhost:1337/login');
  });

  afterAll(() => {
    for (const server of servers) {
      server.close();
    }
  });
});

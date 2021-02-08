require('dotenv').config();
const cors = require('cors');
const axios = require('axios');
const app = require('../lib/app');
const express = require('express');
const {sql, configure} = require('../lib/db');
const oAuth2App = require('../mocks/oAuth2App');

const config = {
  ...process.env,
  DB_NAME: `${process.env.DB_NAME}_test`,
  DISCORD_AUTHORIZATION_URL: 'http://localhost:1447/discord/api/oauth2/authorize',
};
configure(config)

const client = axios.create({
  baseURL: 'http://localhost:1337'
});

describe('endopints involving oAuth2', () => {
  const cache = {
    oAuth2App: oAuth2App(),
    boyo: express(),
    oAuth2Server: undefined,
    boyoServer: undefined,
  };

  beforeAll(async () => {
    cache.boyo.set('config', config);
    cache.boyo.use(cors());
    app(cache.boyo);
    await sql().sync({logging: false, force: true});
    cache.oAuth2Server = await cache.oAuth2App.start(1447);
    cache.boyoServer = await cache.boyo.start(1337);
  });

  it('creates a user and authenticates with Discord', async () => {
    const {data} = await client.get('/login');
    console.log(data);
  });

  afterAll(() => {
    cache.oAuth2Server.close();
    cache.boyoServer.close();
  });
});

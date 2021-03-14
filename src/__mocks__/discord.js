/**
 * @jest-environment node
 */
const url = require('url');
const cors = require('cors');
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// - DISCORD AUTHORIZE
// {
//   response_type: 'code',
//   redirect_uri: 'http://localhost:1337/login/callback',
//   scope: 'identify email guilds',
//   state: 'CfPGChc9VotMdRrxFoXecZKd',
//   client_id: '752638531972890726'
// }
// - DISCORD CALLBACK
// {
//   code: 'd8vtn5s1zlouyyflt94ggglzu2635g',
//   state: 'SdhldATrmBT1WRei8R1GsIX2'
// }
/**
 * oauth2 flow mock
 */
const token = {
  'access_token': 'DsVA5s80g6RUwn7UDUFpCiDph732vo', 
  'expires_in': 604800, 
  'refresh_token': 'i5brYrMXbyigDzGu8RqCwdRNvcrilz', 
  'scope': 'identify email guilds', 
  'token_type': 'Bearer'
};

app.post('/api/guilds/:guildId/channels', (req, res, next) => {
  console.log(req.body);
  console.log(req.headers);
  console.log(req.query);
  console.log(req.params);
  return res.json({foo: bar});
});

app.get('/api/oauth2/authorize', (req, res, next) => {
  return res.redirect(`${req.query.redirect_uri}?${new url.URLSearchParams({
    code: 'd8vtn5s1zlouyyflt94ggglzu2635g',
    state: req.query.state
  }).toString()}`);
});
app.post('/api/oauth2/token', (req, res, next) => {
  return res.json(token);
});

/**
 * resource mocks
 */
app.get('/api/users/@me', (req, res, next) => {
  return res.json({
    'id': '252148211819610112',
    'username': 'IBoyota',
    'avatar': 'c723da6b59e28e16060d13a4edf42e3f',
    'discriminator': '3962',
    'public_flags': 0,
    'flags': 0,
    'locale': 'en-US',
    'mfa_enabled': false,
    'email': 'tjdavenport2@gmail.com',
    'verified': true
  });
});


app.start = port => new Promise(resolve => {
  discord.listen(port, () => resolve(discord));
});

module.exports = app;

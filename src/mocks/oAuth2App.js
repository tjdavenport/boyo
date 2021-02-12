const url = require('url');
const cors = require('cors');
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

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

const tokens = {
  'discord': {
    "access_token": "DsVA5s80g6RUwn7UDUFpCiDph732vo", 
    "expires_in": 604800, 
    "refresh_token": "i5brYrMXbyigDzGu8RqCwdRNvcrilz", 
    "scope": "identify email guilds", 
    "token_type": "Bearer"
  }
};

module.exports = () => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.get('/:service/api/oauth2/authorize', (req, res, next) => {
    return res.redirect(`${req.query.redirect_uri}?${new url.URLSearchParams({
      code: 'd8vtn5s1zlouyyflt94ggglzu2635g',
      state: req.query.state
    }).toString()}`);
  });

  app.post('/:service/api/oauth2/token', (req, res, next) => {
    return res.json(tokens[req.params.service]);
  });

  app.start = port => new Promise(resolve => {
    const server = app.listen(port, () => resolve(server));
  });

  return app;
};

/**
 * @jest-environment node
 */
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

// - NITRADO CALLBACK
// {
//   code: '8LAOPfepPoqcgd2LReBTaaassN-FUMxgMoic3AEug9KVV1fUwvMjf3nBWpjqJ9ctyUMvLAHri9ZNS97eEaxpPc9DPlPQI1gUMdXT',
//   state: '4c65f4b0-6e3e-11eb-a10a-e37e2600d0cc:695309211608940674'
// }

const tokens = {
  'discord': {
    'access_token': 'DsVA5s80g6RUwn7UDUFpCiDph732vo', 
    'expires_in': 604800, 
    'refresh_token': 'i5brYrMXbyigDzGu8RqCwdRNvcrilz', 
    'scope': 'identify email guilds', 
    'token_type': 'Bearer'
  },
  'nitrado': {
    'access_token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjAwMSJ9.eyJqdGkiOiJlMWY5YjdlMC1kMGY3LTQyNmEtOTUxOC1kYWYzZDgyNzk4MzMiLCJuYmYiOjE2MTMyNTA1NjcsInR5cCI6IkJlYXJlciIsImF6cCI6MTU1MywiaXNzIjoibml0cmFwaS00NzYta2xxNTkiLCJzdWIiOiIzODkyODAyIiwiYXVkIjoiIiwiMmZhIjpudWxsLCJleHAiOjE2MTM1MDk3NzcsImlhdCI6MTYxMzI1MDU3Nywic2NvcGUiOiJzZXJ2aWNlIHVzZXJfaW5mbyIsInByZWZlcnJlZF91c2VybmFtZSI6IklCb3lvdGEifQ.q4QYFDYbvDAafI--37BYCZEWQqMYcWj8navBynW8Eb7FtXC6-EvDT8rbtay6MipeXKgZtBhK8YhWoQaxFBsh4FSFDDr61mgt6yOfHYnXNdJWhD0B-sKWsZrl8BRxgEk5GNbHOc73Tiurm0NqsUST-UZjEKHZt781CzU87WOWubB_rLnmnoVtG4zQkVWR3TbpZ62DOlLogcEaELv8WVzYFo5Y3EWqXtvRAtSR8N83i16cabPWr5YRP_wd7BhVq-HmsNbb0xDNvUd9a5RIB7fdaUc4BK-lLp_D3ce3ZSdDVbcxUkSFXgyZ9F3iLlq19HDYYfBCuOi1y_Ju4N1MIHfM2A',
    'refresh_token':'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjAwMSJ9.eyJqdGkiOiJmMTUyNTQxYi1jODgyLTRlNWUtYmI5My01NTczMzcxNDcxYzYiLCJuYmYiOjE2MTMyNTA1NjcsInR5cCI6IlJlZnJlc2giLCJhenAiOjE1NTMsImlzcyI6Im5pdHJhcGktNDc2LWtscTU5Iiwic3ViIjoiMzg5MjgwMiIsImF1ZCI6IiIsIjJmYSI6bnVsbCwiZXhwIjoxNjIxMDI2NTc3LCJpYXQiOjE2MTMyNTA1NzcsInNjb3BlIjoic2VydmljZSB1c2VyX2luZm8iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJJQm95b3RhIn0.27vwW6Hl_tzD-d7nwyO4JdBMa-QaNXw766bX3VwLVNVhIIAkGEWi89tkhQ6lD8YT8DWllShhPYo1jmmzbzy2wIwUbW9KI_sL79z8AMSHSwUzw_GRNY3-5kNxOlQIkWC2odgKtqSyZAAwNiFCbnEvJZXggZgvYHdG9XlOgrWOE1EHwWw2Ue-dEc6xm6PIn9PSEwnr7iVTyvwT-MAVh0HycKnXkHk1cVvCoz2tjR6wrJRu3HcUy0iZLbElJstoWxbBaEIF5rRoxYGxPg7PZqVADx0H2MuM9wK3561zfOtrB3DPgJvicAbm4TTSA7EjYk0PQzr0MGI7yB-Bdqag4P5a9g',
    'token_type': 'Bearer',
    'expires_in': 259200,
    'scope': 'service user_info'
  }
};

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

module.exports = app;

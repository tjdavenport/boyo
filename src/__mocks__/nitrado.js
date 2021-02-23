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


// - NITRADO CALLBACK
// {
//   code: '8LAOPfepPoqcgd2LReBTaaassN-FUMxgMoic3AEug9KVV1fUwvMjf3nBWpjqJ9ctyUMvLAHri9ZNS97eEaxpPc9DPlPQI1gUMdXT',
//   state: '4c65f4b0-6e3e-11eb-a10a-e37e2600d0cc:695309211608940674'
// }

/**
 * oauth2 flow mock
 */
const token = {
  'access_token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjAwMSJ9.eyJqdGkiOiJlMWY5YjdlMC1kMGY3LTQyNmEtOTUxOC1kYWYzZDgyNzk4MzMiLCJuYmYiOjE2MTMyNTA1NjcsInR5cCI6IkJlYXJlciIsImF6cCI6MTU1MywiaXNzIjoibml0cmFwaS00NzYta2xxNTkiLCJzdWIiOiIzODkyODAyIiwiYXVkIjoiIiwiMmZhIjpudWxsLCJleHAiOjE2MTM1MDk3NzcsImlhdCI6MTYxMzI1MDU3Nywic2NvcGUiOiJzZXJ2aWNlIHVzZXJfaW5mbyIsInByZWZlcnJlZF91c2VybmFtZSI6IklCb3lvdGEifQ.q4QYFDYbvDAafI--37BYCZEWQqMYcWj8navBynW8Eb7FtXC6-EvDT8rbtay6MipeXKgZtBhK8YhWoQaxFBsh4FSFDDr61mgt6yOfHYnXNdJWhD0B-sKWsZrl8BRxgEk5GNbHOc73Tiurm0NqsUST-UZjEKHZt781CzU87WOWubB_rLnmnoVtG4zQkVWR3TbpZ62DOlLogcEaELv8WVzYFo5Y3EWqXtvRAtSR8N83i16cabPWr5YRP_wd7BhVq-HmsNbb0xDNvUd9a5RIB7fdaUc4BK-lLp_D3ce3ZSdDVbcxUkSFXgyZ9F3iLlq19HDYYfBCuOi1y_Ju4N1MIHfM2A',
  'refresh_token':'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjAwMSJ9.eyJqdGkiOiJmMTUyNTQxYi1jODgyLTRlNWUtYmI5My01NTczMzcxNDcxYzYiLCJuYmYiOjE2MTMyNTA1NjcsInR5cCI6IlJlZnJlc2giLCJhenAiOjE1NTMsImlzcyI6Im5pdHJhcGktNDc2LWtscTU5Iiwic3ViIjoiMzg5MjgwMiIsImF1ZCI6IiIsIjJmYSI6bnVsbCwiZXhwIjoxNjIxMDI2NTc3LCJpYXQiOjE2MTMyNTA1NzcsInNjb3BlIjoic2VydmljZSB1c2VyX2luZm8iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJJQm95b3RhIn0.27vwW6Hl_tzD-d7nwyO4JdBMa-QaNXw766bX3VwLVNVhIIAkGEWi89tkhQ6lD8YT8DWllShhPYo1jmmzbzy2wIwUbW9KI_sL79z8AMSHSwUzw_GRNY3-5kNxOlQIkWC2odgKtqSyZAAwNiFCbnEvJZXggZgvYHdG9XlOgrWOE1EHwWw2Ue-dEc6xm6PIn9PSEwnr7iVTyvwT-MAVh0HycKnXkHk1cVvCoz2tjR6wrJRu3HcUy0iZLbElJstoWxbBaEIF5rRoxYGxPg7PZqVADx0H2MuM9wK3561zfOtrB3DPgJvicAbm4TTSA7EjYk0PQzr0MGI7yB-Bdqag4P5a9g',
  'token_type': 'Bearer',
  'expires_in': 259200,
  'scope': 'service user_info'
};
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
 * integration mocks
 */
const serviceLogs = [];
app.post('/api/services/:serviceId/gameservers/restart', (req, res, next) => {
  serviceLogs.push({message: 'Server restarted.'});
  return res.json({'status': 'success', 'message': 'Server is restarting ...'});
});
app.get('/api/services/:serviceId/logs', (req, res, next) => {
  return res.json({
    status: 'success',
    data: {logs: serviceLogs}
  });
});
app.get('/api/services', (req, res, next) => {
  return res.json({
    "status": "success",
    "data": {
      "services": [
        {
          "id": 8083482,
          "location_id": 8,
          "status": "active",
          "websocket_token": "9f9b20f7655384df446ab6bbb8ad8b780808dbba",
          "user_id": 3892802,
          "comment": null,
          "auto_extension": true,
          "auto_extension_duration": 720,
          "type": "gameserver",
          "type_human": "Publicserver 16 Slots",
          "managedroot_id": null,
          "details": {
            "address": "134.255.214.58:12200",
            "name": "PureFactionZ Alpha - discord.gg/Z4dQtXR",
            "game": "DayZ (PS4)",
            "portlist_short": "dayzps",
            "folder_short": "dayzps",
            "slots": 16
          },
          "start_date": "2021-02-20T12:58:02",
          "suspend_date": "2021-03-22T14:13:02",
          "delete_date": "2021-03-29T14:13:02",
          "suspending_in": 2506015,
          "deleting_in": 3110815,
          "username": "ni3892802_1",
          "roles": [
            "ROLE_OWNER"
          ]
        }
      ]
    }
  });
});


app.start = port => new Promise(resolve => {
  const server = app.listen(port, () => resolve(server));
});

module.exports = app;

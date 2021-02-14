/**
 * @jest-environment node
 */
const cors = require('cors');
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
  const server = app.listen(port, () => resolve(server));
});

module.exports = app;

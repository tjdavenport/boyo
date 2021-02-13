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
  return res.json({foo: 'bar'});
});

app.start = port => new Promise(resolve => {
  const server = app.listen(port, () => resolve(server));
});

module.exports = app;

const cors = require('cors');
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

module.exports = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  app.get('/api/users/@me', (req, res, next) => {
    return res.json({foo: 'bar'});
  });

  app.start = port => new Promise(resolve => {
    const server = app.listen(port, () => resolve(server));
  });

  return app;
};

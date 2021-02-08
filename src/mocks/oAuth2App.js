const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

module.exports = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  app.get('/:service/api/oauth2/authorize', (req, res, next) => {
    console.log(req.query);
    console.log('poop')
    return res.json('foobar');
  });

  app.start = port => new Promise(resolve => {
    const server = app.listen(port, () => resolve(server));
  });

  return app;
};

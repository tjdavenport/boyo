const log = require('./log');
const axios = require('axios');
const fsx = require('fs-extra');
const express = require('express');
const passport = require('passport');
const {sql, models} = require('./db');
const bodyParser = require('body-parser');
const session = require('express-session');
const {Strategy} = require('passport-oauth2');
const MemoryStore = require('memorystore')(session);
const OAuth2LinkSessionStore = require('./OAuth2LinkSessionStore');

const app = express();
const discord = axios.create({baseURL: process.env.DISCORD_API_URI});

const handle = handler => (req, res, next) => handler.call(null, req, res, next).catch(err => next(err));
const authed = (req, res, next) => req.isAuthenticated() ? next() : res.sendStatus(401);
const setLsKey = lsKey => (req, res) => res.type('html').send(`
  <html><head><script>
    window.localStorage.setItem('${lsKey}', ${req.isAuthenticated()});
    window.close();
  </script></head></html>
`)
const discordios = config => (req, res, next) => discord.request({
  headers: {Authorization: `Bearer ${req.user.accessToken}`},
  ...(typeof config === 'function' ? config(req) : config),
}).then(discordRes => res.status(discordRes.status).json(discordRes.data))
  .catch(error => error.response ? res.status(error.response.status).json(error.response.data) : next(error));

passport.use((() => {
  const nitrado = new Strategy({
    scope: ['user_info', 'service'],
    clientID: process.env.NITRADO_APP_ID,
    clientSecret: process.env.NITRADO_APP_SECRET,
    callbackURL: `${process.env.HOST}/add-service/nitrado/callback`,
    authorizationURL: process.env.NITRADO_AUTHORIZATION_URL,
    tokenURL: process.env.NITRADO_TOKEN_URL,
    passReqToCallback: true,
    state: true,
    store: new OAuth2LinkSessionStore({key: 'oauth2-nitrado'})
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      log.auth(`attempting to create nitrado oauth2 service for user ${req.user.id}`);
      const [uuid, guildId] = req.query.state.split(':');

      log.auth(`attempting to create nitrado oauth2 service for guild ${guildId}`);
      const [service] = await models.OAuth2Link.findOrCreate({
        where: {type: 'nitrado', refreshToken, guildId}
      });
    
      service.accessToken = accessToken;
      service.refreshToken = refreshToken;
      service.guildId = guildId;
      await service.save();

      log.auth(`created nitrado oauth2 service for user ${req.user.id}`);
      done(undefined, req.user);
    } catch (error) {
      log.auth(`failed to create nitrado oauth2 service for user ${req.user.id}`);
      console.error(error);
      done(undefined, error);
    }
  });
  nitrado.name = 'oauth2-nitrado';
  return nitrado;
})());
passport.use(new Strategy({
  scope: ['identify', 'email', 'guilds'],
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: `${process.env.HOST}/login/callback`,
  authorizationURL: process.env.DISCORD_AUTHORIZATION_URL,
  tokenURL: process.env.DISCORD_TOKEN_URL,
  state: true,
}, async (accessToken, refreshToken, profile, done) => {
  log.auth('attempting to authenticate');
  try {
    const [user] = await models.User.findOrCreate({
      where: {refreshToken}
    });
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    await user.save();

    log.auth(`user authenticated`);
    done(undefined, user);
  } catch (error) {
    log.auth('authentication failed');
    console.error(error);
    done(error);
  }
}));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new MemoryStore(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: (1000 * 60 * 60 * 24 * 7),
  },
}));
app.use(passport.initialize());
app.use(passport.session());

/*app.get('/app*', authedRedirect, handle(async (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
}));*/

app.get('/api/users/@me', authed, discordios({url: '/users/@me'}));
app.get('/api/users/@me/guilds', authed, discordios({url: '/users/@me/guilds'}));
app.get('/api/guilds/:guildId/roles', authed, discordios(req => ({
  url: `/guilds/${req.params.guildId}/roles`,
  headers: {
    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
  },
})));

app.get('/:guildId/add-service/nitrado', authed, passport.authenticate('oauth2-nitrado'));
app.get('/add-service/nitrado/callback', passport.authenticate('oauth2-nitrado', {
  failureRedirect: '/login/failure'
}), setLsKey('service-added-nitrado'));

app.get('/login', passport.authenticate('oauth2'));
app.get('/login/callback', passport.authenticate('oauth2', {
  failureRedirect: '/login/failure'
}), setLsKey('isAuthenticated'));

app.get('/add-server/:id', authed, setLsKey('added-server'));

app.get('/', (req, res) => {
  return res.render('Home.jsx', {isAuthenticated: req.isAuthenticated()});
});

module.exports = app;

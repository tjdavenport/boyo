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

const app = express();
const discord = axios.create({baseURL: process.env.DISCORD_API_URI});

const handle = handler => (req, res, next) => handler.call(null, req, res, next).catch(err => next(err));
const authed = (req, res, next) => req.isAuthenticated() ? next() : res.sendStatus(401);
const discordios = config => (req, res, next) => discord.request({
  ...config,
  headers: {Authorization: `Bearer ${req.user.accessToken}`}
}).then(discordRes => res.status(discordRes.status).json(discordRes.data))
  .catch(error => error.response ? res.status(error.response.status).json(error.response.data) : next(error));

passport.use(new Strategy({
  scope: ['identify', 'email', 'guilds'],
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  authorizationURL: process.env.DISCORD_AUTHORIZATION_URL,
  tokenURL: process.env.DISCORD_TOKEN_URL,
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

app.get('/api/users/@me', authed, discordios({url: '/users/@me'}));
app.get('/api/users/@me/guilds', authed, discordios({url: '/users/@me/guilds'}));

app.get('/login', passport.authenticate('oauth2'));
app.get('/login/callback', passport.authenticate('oauth2', {
  failureRedirect: '/login/failure'
}), (req, res) => res.type('html').send(`
  <html><head><script>
    window.localStorage.setItem('isAuthenticated', ${req.isAuthenticated()});
    window.close();
  </script></head></html>
`));

app.get('/', (req, res) => {
  return res.render('Home.jsx');
});

module.exports = app;

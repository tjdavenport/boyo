const log = require('./log');
const fsx = require('fs-extra');
const express = require('express');
const passport = require('passport');
const {sql, models} = require('./db');
const bodyParser = require('body-parser');
const session = require('express-session');
const {Strategy} = require('passport-discord');
const MemoryStore = require('memorystore')(session);

const app = express();
const handle = handler => (req, res, next) => {
  handler.call(null, req, res, next).catch(err => next(err));
};

passport.use(new Strategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  prompt: 'content',
  scope: ['identify', 'email', 'guilds', 'bot'],
}, async (accessToken, refreshToken, profile, done) => {
  log.auth('attempting to authenticate');
  try {
    const [user] = await models.User.findOrCreate({
      where: {
        discordId: profile.id,
      }
    });
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    await user.save();

    log.auth(`user ${profile.id} authenticated`);
    done(undefined, user.toJSON());
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

app.get('/login', passport.authenticate('discord'));
app.get('/login/callback', passport.authenticate('discord', {
  failureRedirect: '/login/failure'
}), (req, res) => res.json('done!'));

module.exports = app;

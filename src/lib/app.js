const db = require('./db');
const cors = require('cors');
const axios = require('axios');
const fsx = require('fs-extra');
const discord = require('./http');
const passport = require('passport');
const EventEmitter = require('events');
const bodyParser = require('body-parser');
const session = require('express-session');
const {Strategy} = require('passport-oauth2');
const MemoryStore = require('memorystore')(session);
const {default: axiosRefresh} = require('axios-auth-refresh');
const OAuth2LinkSessionStore = require('./OAuth2LinkSessionStore');

module.exports = app => {
  const models = db.models();
  const log = app.get('log');
  const config = app.get('config');

  const handle = handler => (req, res, next) => handler.call(null, req, res, next).catch(err => next(err));
  const authed = (req, res, next) => req.isAuthenticated() ? next() : res.sendStatus(401);
  const suicideWindow = (req, res) => res.type('html').send(`
    <html><head><script>
      window.close();
    </script></head></html>
  `)
  const discordios = options => (req, res, next) => discord(config).request(typeof options === 'function' ? options(req) : options)
    .then(discordRes => res.set('Cache-Control', 'public, max-stale=4').status(discordRes.status).json(discordRes.data))
    .catch(error => error.response ? res.status(error.response.status).json(error.response.data) : next(error));

  const nitradios = options => handle(async (req, res, next) => {
    const oAuth2Link = await models.OAuth2Link.findOne({
      where: {guildId: req.params.guildId, type: 'nitrado'}
    });

    const nitrado = axios.create({
      baseURL: config.NITRADO_API_URI,
    });

    axiosRefresh(nitrado, failedReq => axios.post(config.NITRADO_TOKEN_URL, {
      'client_id': config.NITRADO_APP_ID,
      'client_secret': config.NITRADO_APP_SECRET,
      'grant_type': 'refresh_token',
      'refresh_token': oAuth2Link.refreshToken
    }).then(refreshRes => {
      oAuth2Link.save({
        accessToken: refreshRes.data['access_token'],
        refreshToken: refreshRes.data['refresh_token']
      });
      failedReq.response.config.headers['Authorization'] = 'Bearer ' + refreshRes.data['access_token'];
      return Promise.resolve();
    }));

    return nitrado.request((({headers = {}, ...options}) => ({
      ...options,
      headers: {...headers, Authorization: `Bearer ${oAuth2Link.accessToken}`}
    }))(typeof options === 'function' ? options(req) : options))
      .then(nitradoRes => res.set('Cache-Control', 'public, max-stale=4').status(nitradoRes.status).json(nitradoRes.data))
      .catch(error => error.response ? res.status(error.response.status).json(error.response.data) : next(error));
  });

  passport.use((() => {
    const nitrado = new Strategy({
      scope: ['user_info', 'service'],
      clientID: config.NITRADO_APP_ID,
      clientSecret: config.NITRADO_APP_SECRET,
      callbackURL: `${config.ORIGIN}/add-service/nitrado/callback`,
      authorizationURL: config.NITRADO_AUTHORIZATION_URL,
      tokenURL: config.NITRADO_TOKEN_URL,
      passReqToCallback: true,
      state: true,
      store: new OAuth2LinkSessionStore({key: 'oauth2-nitrado'})
    }, async (req, accessToken, refreshToken, profile, done) => {
      try {
        log.auth(`attempting to create nitrado oauth2 link for user ${req.user.id}`);
        const [uuid, guildId] = req.query.state.split(':');

        log.auth(`attempting to create nitrado oauth2 link for guild ${guildId}`);
        const [link] = await models.OAuth2Link.findOrCreate({
          where: {type: 'nitrado', refreshToken, guildId}
        });
      
        link.accessToken = accessToken;
        link.refreshToken = refreshToken;
        link.guildId = guildId;
        await link.save();

        log.auth(`created nitrado oauth2 link for user ${req.user.id}`);
        done(undefined, req.user);
      } catch (error) {
        log.auth(`failed to create nitrado oauth2 link for user ${req.user.id}`);
        console.error(error);
        done(undefined, error);
      }
    });
    nitrado.name = 'oauth2-nitrado';
    return nitrado;
  })());
  passport.use(new Strategy({
    scope: ['identify', 'email', 'guilds', 'applications.commands'],
    clientID: config.DISCORD_CLIENT_ID,
    clientSecret: config.DISCORD_CLIENT_SECRET,
    callbackURL: `${config.ORIGIN}/login/callback`,
    authorizationURL: config.DISCORD_AUTHORIZATION_URL,
    tokenURL: config.DISCORD_TOKEN_URL,
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

      done(undefined, user);
      log.auth(`user authenticated`);
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
    secret: config.SESSION_SECRET,
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

  /**
   * internal rest endpoints
   */
  app.patch('/api/guilds/:guildId/attached-bot-command', authed, handle(async (req, res) => {
    const [attachedBotCommand, built] = await models.AttachedBotCommand.findOrBuild({
      where: {guildId: req.params.guildId, key: req.body.key},
    });
    attachedBotCommand.config = req.body.config;
    await attachedBotCommand.save();
    return res.json(attachedBotCommand.toJSON());
  }));
  app.get('/api/guilds/:guildId/attached-bot-commands', authed, handle(async (req, res) => {
    const attachedBotCommands = await models.AttachedBotCommand.findAll({
      where: {guildId: req.params.guildId},
    });
    return res.json(attachedBotCommands.map(command => command.toJSON()));
  }));
  app.get('/api/guilds/:guildId/oauth2-links', authed, handle(async (req, res) => {
    const oAuth2Links = await models.OAuth2Link.findAll({
      where: {guildId: req.params.guildId},
      attributes: ['type', 'guildId', 'createdAt', 'updatedAt']
    });
    return res.json(oAuth2Links.map(link => link.toJSON()));
  }));
  app.get('/api/is-authenticated', (req, res) => res.json(req.isAuthenticated()));
  app.get('/api/user', authed, (req, res) => res.json(req.user));

  /**
   * external service wrappers
   */
  app.get('/api/guilds/:guildId/nitrado/services', authed, nitradios(req => ({
    url: `/services`,
  })));
  app.get('/api/guilds/:guildId/nitrado/services/:serviceId/logs', authed, nitradios(req => ({
    url: `/services/${req.params.serviceId}/logs`,
  })));
  app.get('/api/guilds/:guildId', authed, discordios(req => ({
    url: `/guilds/${req.params.guildId}`,
  })));
  app.get('/api/guilds/:guildId/roles', authed, discordios(req => ({
    url: `/guilds/${req.params.guildId}/roles`,
  })));

  /**
   * oauth2 integrations
   */
  app.get('/guilds/:guildId/add-service/nitrado', authed, passport.authenticate('oauth2-nitrado'));
  app.get('/add-service/nitrado/callback', passport.authenticate('oauth2-nitrado', {
    //failureRedirect: '/login/failure'
  }), suicideWindow);

  app.get('/login', passport.authenticate('oauth2'));
  app.get('/login/callback', passport.authenticate('oauth2', {
    //failureRedirect: '/login/failure'
  }), suicideWindow);

  app.get('/', (req, res) => {
    return res.render('Home.jsx', {isAuthenticated: req.isAuthenticated()});
  });

  app.start = port => new Promise(resolve => {
    const server = app.listen(port, () => resolve(server));
  });
};

const uuid = require('uuid');
const SessionStore = require('passport-oauth2/lib/state/session');

function OAuth2LinkSessionStore(options) {
  SessionStore.call(this, options);
}

OAuth2LinkSessionStore.prototype = {
  ...SessionStore.prototype,
  /**
   * Store request state.
   *
   * Create state from uid and a Discord guildId passed through req params
   *
   * @param {Object} req
   * @param {Function} callback
   * @api protected
   */
  store: function(req, callback) {
    if (!req.session) { return callback(new Error('OAuth 2.0 authentication requires session support when using state. Did you forget to use express-session middleware?')); }

    var key = this._key;
    var state = `${uuid.v1()}:${req.params.guildId}`;
    if (!req.session[key]) { req.session[key] = {}; }
    req.session[key].state = state;
    callback(null, state);
  }
};

module.exports = OAuth2LinkSessionStore;

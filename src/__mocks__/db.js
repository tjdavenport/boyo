const db = require('../lib/db');
const config = require('./config');

db.configure(config);

module.exports = db;

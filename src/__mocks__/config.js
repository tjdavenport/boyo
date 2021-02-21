/**
 * @jest-environment node
 */
require('dotenv').config();

module.exports = {
  ...process.env,
  DB_NAME: `${process.env.DB_NAME}_test`,

  NITRADO_AUTHORIZATION_URL: 'http://localhost:1447/api/oauth2/authorize',
  NITRADO_TOKEN_URL: 'http://localhost:1447/api/oauth2/token',
  NITRADO_API_URI: 'http://localhost:1447/api',

  DISCORD_AUTHORIZATION_URL: 'http://localhost:1557/api/oauth2/authorize',
  DISCORD_TOKEN_URL: 'http://localhost:1557/api/oauth2/token',
  DISCORD_API_URI: 'http://localhost:1557/api',
};

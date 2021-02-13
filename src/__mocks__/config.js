/**
 * @jest-environment node
 */
require('dotenv').config();

module.exports = {
  ...process.env,
  DB_NAME: `${process.env.DB_NAME}_test`,
  DISCORD_AUTHORIZATION_URL: 'http://localhost:1447/discord/api/oauth2/authorize',
  DISCORD_TOKEN_URL: 'http://localhost:1447/discord/api/oauth2/token',
  DISCORD_API_URI: 'http://localhost:1557/api',
};

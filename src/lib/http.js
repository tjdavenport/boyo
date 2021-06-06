const axios = require('axios');

exports.discord = config => {
  return axios.create({
    baseURL: config.DISCORD_API_URI,
    headers: {Authorization: `Bot ${config.DISCORD_BOT_TOKEN}`}
  });
};

const boyo = require('./src/__mocks__/boyo');
const {sql, configure} = require('./src/lib/db');
const config = require('./src/__mocks__/config');
const nitrado = require('./src/__mocks__/nitrado');
const discord = require('./src/__mocks__/discord');
const servers = [];

configure(config);

module.exports = async () => {
  await sql().sync({logging: false, force: true});
  servers.push(await boyo.start(1337));
  servers.push(await nitrado.start(1447));
  servers.push(await discord.start(1557));
  global.servers = servers;
};

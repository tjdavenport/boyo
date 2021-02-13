module.exports = async () => {
  const {sql, configure} = require('../lib/db');

  for (const server of global.servers) {
    server.close();
    await sql().close();
  }
};

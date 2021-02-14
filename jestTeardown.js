module.exports = async () => {
  for (const server of global.servers) {
    server.close();
  }
};

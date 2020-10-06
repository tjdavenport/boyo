require('dotenv').config();

const app = require('./lib/app');
const log = require('./lib/log');
const {sql} = require('./lib/db');
const {program} = require('commander');

(async () => {
  program
    .command('db:test-connection')
    .action(async () => {
      log.db('testing db connection');

      try {
        await sql.authenticate({logging: false});
        log.db('cb connection active');
        await sql.close();
      } catch (error) {
        log.db('db connection failed');
        console.error(error);
      }
    });

  program
    .command('db:seed:tables')
    .action(async () => {
      await sql.sync({logging: false, force: true});
      log.db('tables seeded');
      await sql.close();
    });

  program
    .command('serve <port>')
    .action(async port => {
      app.listen(port, () => log.http(`listening on ${port}`));
    });

  await program.parseAsync();
})();

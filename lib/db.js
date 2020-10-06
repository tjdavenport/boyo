const Sequelize = require('sequelize');

const {DataTypes} = Sequelize;

const {
  DB_NAME,
  DB_USERNAME,
  DB_PORT,
  DB_PASSWORD = '',
  DB_HOST
} = process.env;

const sql = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  dialect: 'postgres',
  port: DB_PORT,
});

const models = {
  User: sql.define('User', {
    discordId: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    accessToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    refreshToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  })
};

module.exports = {sql, models};

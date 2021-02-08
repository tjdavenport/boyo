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
    accessToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    refreshToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }),
  AttachedBotCommand: sql.define('AttachedBotCommand', {
    key: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    guildId: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    config: {
      type: DataTypes.JSON(),
      allowNull: false,
      defaultValue: {}
    },
  }),
  AttachedBotService: sql.define('AttachedBotService', {
    key: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    guildId: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    config: {
      type: DataTypes.JSON(),
      allowNull: false,
      defaultValue: {}
    },
  }),
  OAuth2Link: sql.define('OAuth2Link', {
    type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    guildId: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    accessToken: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    refreshToken: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
  }),
};

module.exports = {sql, models};

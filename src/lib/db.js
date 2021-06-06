const Sequelize = require('sequelize');

const {DataTypes} = Sequelize;
const cache = {
  models: {},
  connection: undefined,
};

module.exports = {
  models: () => cache.models,
  sql: () => cache.connection,
  configure: config => {
    const {
      DB_NAME,
      DB_USERNAME,
      DB_PORT,
      DB_PASSWORD = '',
      DB_HOST
    } = config;

    const sql = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
      dialect: 'postgres',
      port: DB_PORT,
      logging: config.logging === false ? false : undefined
    });
    cache.connection = sql;

    Object.entries({
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
      AttachedService: sql.define('AttachedService', {
        key: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        guildId: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        document: {
          type: DataTypes.JSON(),
          allowNull: false,
          defaultValue: {
            permissions: [],
            guildApplicationCommands: [],
          }
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
      AutoFaction: sql.define('AutoFaction', {
        guildId: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        leaderId: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        channelId: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        roleId: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
      }),
    }).forEach(([key, model]) => cache.models[key] = model);
  },
};

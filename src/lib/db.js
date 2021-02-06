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
  Game: sql.define('Game', {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  }),
  BotService: sql.define('BotService', {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  }),
  BotCommand: sql.define('BotCommand', {
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    initiator: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  }),
  AttachedBotService: sql.define('AttachedBotService', {
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
  OAuth2Service: sql.define('OAuth2Service', {
    type: {
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

models.BotService.belongsTo(models.Game, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'gameId',
    allowNull: false,
  },
});
models.BotCommand.belongsTo(models.BotService, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'botServiceId',
    allowNull: false,
  },
});
models.AttachedBotService.belongsTo(models.BotService, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'botServiceId',
    allowNull: false,
  },
});
models.User.hasMany(models.OAuth2Service, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
});

module.exports = {sql, models};

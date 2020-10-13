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

models.User.hasMany(models.OAuth2Service, {
  onDelete: 'CASCADE',
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
});

module.exports = {sql, models};

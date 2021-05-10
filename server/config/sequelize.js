const Sequelize = require("sequelize");
const configuration = require("../../configuration");
const { db } = process.env.PROD ? configuration.prod : configuration.dev;

const sequelize = new Sequelize(db.database, db.userName, db.password, {
  dialect: db.dialect,
  host: db.host,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;

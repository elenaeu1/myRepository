module.exports = function (sequelize, DataTypes) {
  return sequelize.define("bankAccount", {
    iban: DataTypes.STRING,
  });
};

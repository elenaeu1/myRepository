module.exports = function (sequelize, DataTypes) {
  return sequelize.define("payment", {
    number: DataTypes.STRING,
    value: DataTypes.FLOAT,
  });
};

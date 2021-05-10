module.exports = function (sequelize, DataTypes) {
  return sequelize.define("item", {
    name: DataTypes.STRING,
  });
};

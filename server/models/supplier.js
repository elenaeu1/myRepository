module.exports = function (sequelize, DataTypes) {
  return sequelize.define("supplier", {
    name: DataTypes.STRING,
    headquarter: DataTypes.STRING,
    CUI: DataTypes.STRING,
    ORC: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    fax: DataTypes.STRING,
  });
};

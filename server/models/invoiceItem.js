module.exports = function (sequelize, DataTypes) {
  return sequelize.define("invoiceItem", {
    noUnits: DataTypes.FLOAT,
    value: DataTypes.FLOAT,
  });
};

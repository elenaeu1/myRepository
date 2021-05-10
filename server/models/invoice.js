module.exports = function (sequelize, DataTypes) {
  return sequelize.define("invoice", {
    issueDate: DataTypes.STRING,
    dueDate: DataTypes.STRING,
    number: DataTypes.STRING,
    dueDate: DataTypes.STRING,
    paidDate: DataTypes.STRING,
    currency: DataTypes.STRING,
  });
};

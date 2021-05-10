const { sequelize } = require("../config");

const User = sequelize.import("./user");
const Invoice = sequelize.import("./invoice");
const BankAccount = sequelize.import("./bankAccount");
const InvoiceItem = sequelize.import("./invoiceItem");
const Item = sequelize.import("./item");
const Payment = sequelize.import("./payment");
const Supplier = sequelize.import("./supplier");
const Category = sequelize.import("./category");

User.hasMany(Invoice, { onDelete: "Cascade" });

Item.hasMany(InvoiceItem, { onDelete: "Cascade" });
Invoice.hasMany(InvoiceItem, { onDelete: "Cascade" });
Invoice.hasMany(Payment, { onDelete: "Cascade" });
Supplier.hasMany(Invoice, { onDelete: "Cascade" });
Supplier.hasMany(BankAccount, { onDelete: "Cascade" });
BankAccount.hasMany(Payment, { onDelete: "Cascade" });
Category.hasMany(Supplier, { onDelete: "Cascade" });

module.exports = {
  User,
  Invoice,
  BankAccount,
  InvoiceItem,
  Item,
  Payment,
  Supplier,
  Category,
  sequelize,
};

const {
  User,
  Invoice,
  Payment,
  InvoiceItem,
  Item,
  BankAccount,
} = require("../models");

const controller = {
  getUserInfo: async (req, res) => {
    try {
      const { id, firstName, lastName, email, isAdmin } = req.user;

      res.status(200).send({ id, firstName, lastName, email, isAdmin });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  getUsersInvoices: async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        res.status(403).send({ message: "Not allowed" });
      } else {
        const rawUsers = await User.findAll({
          attributes: ["id", "firstName", "lastName", "email", "isAdmin"],
          raw: true,
        });

        const users = await Promise.all(
          rawUsers.map(async (user) => {
            const invoicesRaw = await Invoice.findAll({
              where: { userId: user.id },
              raw: true,
            });

            const invoices = await Promise.all(
              invoicesRaw.map(async (invoice) => {
                const rawPayments = await Payment.findAll({
                  where: { invoiceId: invoice.id },
                  raw: true,
                });
                let paid = 0;
                const payments = await Promise.all(
                  rawPayments.map(async (payment) => {
                    const bankAccount = await BankAccount.findOne({
                      where: { id: payment.bankAccountId },
                    });
                    paid += payment.value;
                    return { ...payment, bankAccount };
                  })
                );

                const rawItems = await InvoiceItem.findAll({
                  where: { invoiceId: invoice.id },
                  raw: true,
                });
                let value = 0;
                const items = await Promise.all(
                  rawItems.map(async (item) => {
                    const info = await Item.findOne({
                      where: { id: item.itemId },
                    });
                    value += item.value;
                    return { ...item, info };
                  })
                );
                const sold = value - paid;
                return { ...invoice, value, paid, sold, payments, items };
              })
            );

            return {
              invoices,
              ...user,
            };
          })
        );
        res.status(200).send(users);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err });
    }
  },

  getUserInvoices: async (req, res) => {
    try {
      const invoicesRaw = await Invoice.findAll({
        where: { userId: user.id },
        raw: true,
      });

      const invoices = await Promise.all(
        invoicesRaw.map(async (invoice) => {
          const rawPayments = await Payment.findAll({
            where: { invoiceId: invoice.id },
            raw: true,
          });
          let paid = 0;
          const payments = await Promise.all(
            rawPayments.map(async (payment) => {
              const bankAccount = await BankAccount.findOne({
                where: { id: payment.bankAccountId },
              });
              paid += payment.value;
              return { ...payment, bankAccount };
            })
          );

          const rawItems = await InvoiceItem.findAll({
            where: { invoiceId: invoice.id },
            raw: true,
          });
          let value = 0;
          const items = await Promise.all(
            rawItems.map(async (item) => {
              const info = await Item.findOne({
                where: { id: item.itemId },
              });
              value += item.value;
              return { ...item, info };
            })
          );
          const sold = value - paid;
          return { ...invoice, value, paid, sold, payments, items };
        })
      );

      res.status(200).send(invoices);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err });
    }
  },
};

module.exports = controller;

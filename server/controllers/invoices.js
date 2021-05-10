const {
  Supplier,
  Invoice,
  InvoiceItem,
  Item,
  BankAccount,
  Payment,
} = require("../models");

const controller = {
  getInvoices: async (req, res) => {
    try {
      const invoices = await Invoice.findAll({
        raw: true,
        where: { userId: req.user.id },
        order: [["dueDate", "DESC"]],
      });

      const invoicesFormatted = await Promise.all(
        invoices.map(async (invoice) => {
          const supplier = await Supplier.findOne({
            where: { id: invoice.supplierId },
            raw: true,
          });

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
              const info = await Item.findOne({ where: { id: item.itemId } });
              value += item.value;
              return { ...item, info };
            })
          );
          const sold = value - paid;
          return { ...invoice, supplier, value, paid, sold, payments, items };
        })
      );

      res.status(200).send(invoicesFormatted);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    }
  },
  addInvoice: async (req, res) => {
    try {
      const {
        supplierId,
        issueDate,
        currency,
        dueDate,
        number,
        items,
      } = req.body;

      const supplier = await Supplier.findOne({
        where: { id: supplierId },
        raw: true,
      });

      if (supplier) {
        const invoice = await Invoice.create({
          supplierId,
          issueDate,
          currency,
          dueDate,
          number,
          userId: req.user.id,
        });

        await Promise.all(
          items.map(async (item) => {
            const itemData = await Item.findOne({ where: { name: item.name } });

            if (itemData) {
              await InvoiceItem.create({
                noUnits: item.noUnits,
                value: item.value,
                itemId: itemData.id,
                invoiceId: invoice.id,
              });
            } else {
              const itemData = await Item.create({ name: item.name });
              await InvoiceItem.create({
                noUnits: item.noUnits,
                value: item.value,
                itemId: itemData.id,
                invoiceId: invoice.id,
              });
            }
          })
        );

        res.status(200).send({ message: "Invoice created" });
      } else {
        res.status(404).send({ message: "Supplier doesn't exists" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    }
  },
  editInvoice: async (req, res) => {
    try {
      const { id, issueDate, value, currency, dueDate, items } = req.body;

      const invoice = await Invoice.findOne({
        where: { id },
      });

      if (invoice) {
        const invoice = await invoice.update({
          supplierId: invoice.supplierId,
          issueDate: issueDate ? issueDate : invoice.issueDate,
          currency: currency ? currency : invoice.currency,
          dueDate: dueDate ? dueDate : invoice.dueDate,
          number: number ? number : invoice.number,

          userId: invoice.userId,
        });

        // await Promise.all(
        //   items.map(async (item) => {
        //     const itemData = await Item.findOne({
        //       where: { name: item.name },
        //     });
        //     const invoice = await InvoiceItem.findOne({
        //       id: item.id,
        //     });
        //     switch (item.operation) {
        //       case "ADD": {
        //         if (itemData) {
        //           await InvoiceItem.create({
        //             noUnits: item.noUnits,
        //             value: item.value,
        //             itemId: itemData.id,
        //             invoiceId: invoice.id,
        //           });
        //         } else {
        //           const itemData = await Item.create({ name: item.name });
        //           await InvoiceItem.create({
        //             noUnits: item.noUnits,
        //             value: item.value,
        //             itemId: itemData.id,
        //             invoiceId: invoice.id,
        //           });
        //         }
        //         break;
        //       }
        //       case "EDIT": {
        //         if (itemData) {
        //           const x = await InvoiceItem.findOne({
        //             noUnits: item.noUnits,
        //             value: item.value,
        //             itemId: itemData.id,
        //             invoiceId: invoice.id,
        //           });
        //         } else {
        //           const itemData = await Item.create({ name: item.name });
        //           await InvoiceItem.create({
        //             noUnits: item.noUnits,
        //             value: item.value,
        //             itemId: itemData.id,
        //             invoiceId: invoice.id,
        //           });
        //         }
        //         break;
        //       }
        //       case "DELETE": {
        //         if (itemData) {
        //           await InvoiceItem.create({
        //             noUnits: item.noUnits,
        //             value: item.value,
        //             itemId: itemData.id,
        //             invoiceId: invoice.id,
        //           });
        //         } else {
        //           const itemData = await Item.create({ name: item.name });
        //           await InvoiceItem.create({
        //             noUnits: item.noUnits,
        //             value: item.value,
        //             itemId: itemData.id,
        //             invoiceId: invoice.id,
        //           });
        //         }
        //         break;
        //       }
        //     }
        //   })
        // );

        res.status(200).send({ message: "Invoice edited" });
      } else {
        res.status(404).send({ message: "Supplier doesn't exists" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    }
  },
  executePayment: async (req, res) => {
    try {
      const { number, type, value, invoiceId, bankAccountId } = req.body;

      const invoice = await Invoice.findOne({
        where: { id: invoiceId },
      });
      const bankAccount = await BankAccount.findOne({
        where: { id: bankAccountId },
        raw: true,
      });

      if (invoice && bankAccount) {
        const payment = await Payment.create({
          number,
          type,
          value,
          invoiceId,
          bankAccountId,
        });
        await invoice.update({
          ...invoice,
          paidDate: new Date(Date.now()).toLocaleString().split(" ")[0],
        });

        res.status(200).send({ message: "Invoice paid" });
      } else {
        res
          .status(404)
          .send({ message: "Invoice or bank account doesn't exists" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    }
  },
};

module.exports = controller;

const { Supplier, Category, BankAccount } = require("../models");

const controller = {
  getSuppliers: async (req, res) => {
    try {
      const suppliers = await Supplier.findAll({
        attributes: [
          "id",
          "name",
          "CUI",
          "ORC",
          "phone",
          "headquarter",
          "email",
          "fax",
          "categoryId",
        ],
        raw: true,
      });

      const suppliersFormatted = await Promise.all(
        suppliers.map(async (supplier) => {
          const category = await Category.findOne({
            where: { id: supplier.categoryId },
          });

          const bankAccounts = await BankAccount.findAll({
            where: { supplierId: supplier.id },
          });

          return { ...supplier, category, bankAccounts };
        })
      );

      res.status(200).send(suppliersFormatted);
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  addSupplier: async (req, res) => {
    try {
      const {
        name,
        CUI,
        ORC,
        phone,
        headquarter,
        email,
        fax,
        categoryId,
      } = req.body;

      await Supplier.create({
        name,
        CUI,
        ORC,
        phone,
        email,
        headquarter,
        fax,
        categoryId,
      });

      res.status(200).send({ message: `Supplier ${name} was added.` });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err });
    }
  },
  removeSupplier: async (req, res) => {
    try {
      const { id } = req.body;

      const supplier = await Supplier.findOne({
        where: {
          id,
        },
      });

      if (!supplier) {
        res.status(404).send({ message: `Supplier doesn't exists` });
      } else {
        await supplier.destroy();

        res
          .status(200)
          .send({ message: `Supplier ${supplier.name} was deleted.` });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err });
    }
  },
  editSupplier: async (req, res) => {
    try {
      const {
        id,
        name,
        CUI,
        ORC,
        phone,
        email,
        fax,
        headquarter,
        categoryId,
        bankAccounts,
      } = req.body;

      const supplier = await Supplier.findOne({
        where: {
          id,
        },
      });

      if (!supplier) {
        res.status(404).send({ message: `Supplier doesn't exists` });
      } else {
        console.log(bankAccounts);
        if (bankAccounts) {
          bankAccounts.forEach(async (bankAccount) => {
            if (bankAccount.operation === "DELETE") {
              const bankData = await BankAccount.findOne({
                where: { iban: bankAccount.iban, supplierId: supplier.id },
              });
              if (bankData) {
                await bankData.destroy();
              } else {
                throw Error("bank iban doesn't exists");
              }
            } else if (bankAccount.operation === "ADD") {
              await BankAccount.create({
                iban: bankAccount.iban,
                supplierId: supplier.id,
              });
            }
          });
        }

        await supplier.update({
          ...supplier,
          name: name ? name : supplier.name,
          CUI: CUI ? CUI : supplier.CUI,
          ORC: ORC ? ORC : supplier.ORC,
          phone: phone ? phone : supplier.phone,
          email: email ? email : supplier.email,
          fax: fax ? fax : supplier.fax,
          headquarter: headquarter ? headquarter : supplier.headquarter,
          categoryId: categoryId ? categoryId : supplier.categoryId,
        });

        res
          .status(200)
          .send({ message: `Supplier ${supplier.name} was edited.` });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: err });
    }
  },
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;

      await Category.create({
        name,
      });

      res.status(200).send({ message: `Category ${name} was created.` });
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  removeCategory: async (req, res) => {
    try {
      const { id } = req.body;

      const category = await Category.findOne({
        where: {
          id,
        },
      });

      if (!category) {
        res.status(404).send({ message: `Category doesn't exists` });
      } else {
        await category.destroy();

        res
          .status(200)
          .send({ message: `Category ${category.name} was deleted.` });
      }
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({
        attributes: ["id", "name"],
        raw: true,
      });

      res.status(200).send(categories);
    } catch (err) {
      res.status(500).send({ message: err });
    }
  },
};

module.exports = controller;

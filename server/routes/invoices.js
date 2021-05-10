const express = require("express");
const router = express.Router();

const { invoices, users } = require("../controllers");

router.get("/", invoices.getInvoices);

router.post("/", invoices.addInvoice);

// router.delete("/", invoices.removeSupplier);

router.put("/", invoices.editInvoice);

router.post("/payment", invoices.executePayment);

router.get("/all", users.getUsersInvoices);

module.exports = router;

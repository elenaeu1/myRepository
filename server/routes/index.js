const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../controllers").auth.middleware;

const reset = require("./reset");
const auth = require("./auth");
const suppliers = require("./suppliers");
const invoices = require("./invoices");

router.use("/reset", reset);
router.use("/auth", auth);
router.use("/suppliers", isAuthenticated, suppliers);
router.use("/invoices", isAuthenticated, invoices);

module.exports = router;

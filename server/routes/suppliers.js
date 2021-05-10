const express = require("express");
const router = express.Router();

const { suppliers } = require("../controllers");

router.get("/", suppliers.getSuppliers);

router.post("/", suppliers.addSupplier);

router.delete("/", suppliers.removeSupplier);

router.put("/", suppliers.editSupplier);

router.get("/categories", suppliers.getCategories);

router.delete("/categories", suppliers.removeCategory);

router.post("/categories", suppliers.addCategory);

module.exports = router;

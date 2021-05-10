const express = require("express");
const router = express.Router();
const { auth, users } = require("../controllers");

router.post("/login", auth.middleware.authenticate, users.getUserInfo);
router.post("/register", auth.register);
router.get("/logout", auth.middleware.isAuthenticated, auth.logout);

module.exports = router;

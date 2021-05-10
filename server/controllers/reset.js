const { sequelize, User } = require("../models");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
module.exports = {
  reset: async (req, res) => {
    try {
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash("admin", salt, async (err, hash) => {
          await sequelize.sync({ force: true });

          const user = await User.create({
            firstName: "Admin",
            lastName: "Admin",
            email: "admin",
            isAdmin: true,
            token: Math.random().toString(36),
            password: hash,
          });
          res.status(200).send({
            message: `User ${user.firstName} ${user.lastName} was created`,
          });
        });
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Server error :(",
      });
    }
  },
};

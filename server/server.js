const express = require("express");
const router = require("./routes");
const bodyParser = require("body-parser");
const passport = require("passport");
const serveStatic = require("serve-static");
const history = require("connect-history-api-fallback");
const { sequelize, User } = require("./models");
const { session } = require("./config");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const app = express();

bcrypt.genSalt(saltRounds, (err, salt) => {
  bcrypt.hash("admin", salt, async (err, hash) => {
    try {
      await sequelize.sync();
      console.log("Database syncronized");
      const user = await User.findOne({ where: { email: "admin" } });
      if (!user) {
        await User.create({
          firstName: "Admin",
          lastName: "Admin",
          email: "admin",
          isAdmin: true,
          token: Math.random().toString(36),
          password: hash,
        });
        console.log("Admin user was created");
      }
    } catch (error) {
      console.error(error);
    }
  });
});
const configure = (app) => {
  app.use(bodyParser.json());
  app.use(session);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(history());
  app.use(serveStatic(__dirname + "/../client/dist/spa"));

  app.use("/api", router);
};

module.exports = configure;

configure(app);

const port = process.env.PORT || 8081;
app.listen(port, () =>
  console.log(`I am running on port ${port}: http://localhost:${port}`)
);

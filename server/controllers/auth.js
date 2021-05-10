const bcrypt = require("bcryptjs");
const passport = require("passport");
const saltRounds = 10;
const { User } = require("../models");

const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      const user = await User.findOne({ where: { email }, raw: true });
      if (user) {
        bcrypt.compare(password, user.password, async (err, result) => {
          if (result) {
            return done(null, user); //login cu succes
          } else {
            return done(null, false, { message: "Incorrect password" });
          }
        });
      } else {
        return done(null, false, { message: "Incorrect email" });
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({ where: { id }, raw: true });

  done(null, user);
});

const middleware = {
  isAuthenticated: async (req, res, next) => {
    if (!req.isAuthenticated()) {
      res.status(403).send({ message: "Unauthorized" });
    } else {
      return next();
    }
  },
  authenticate: passport.authenticate("local"),
};

const controller = {
  register: async (req, res) => {
    const { email, firstName, lastName, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (user)
      res.status(401).send({
        message: `Email ${user.email} is already registered.`,
      });
    else
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          try {
            const errors = [];
            if (!firstName) {
              errors.push("Incorect first name");
            }

            if (errors.length > 0) {
              res.status(400).send({
                errors,
              });
            } else {
              const user = await User.create({
                firstName,
                lastName,
                email,
                isAdmin: false,
                token: Math.random().toString(36),
                password: hash,
              });
              res.status(200).send({
                message: `User ${user.firstName} ${user.lastName} was created`,
              });
            }
          } catch (e) {
            console.error(e);
            res.status(500).send({ message: "Server error :(" });
          }
        });
      });
  },
  logout: (req, res) => {
    req.logout();
    res.status(200).send({ message: "You've been logged out" });
  },
  middleware,
};

module.exports = controller;

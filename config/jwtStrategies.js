const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/userModel");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    User.findOne({ email: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Email is not registered" });
      }
      if (!user.verifyPassword(password)) {
        return done(null, false, { message: "Wrong password" });
      }
      return done(null, user);
    });
  })
);

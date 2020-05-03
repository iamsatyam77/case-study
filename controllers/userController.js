const passport = require("passport");

const sendGrid = require("../services/sendGridHelper");
const User = require("../models/userModel");

module.exports = {
  register: async (req, res, next) => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    });
    user
      .save()
      .then((doc) => {
        res.status(200).json({
          message: "User registered successfully!",
          data: doc,
        });
      })
      .catch((error) => {
        next(error);
      });
  },

  login: (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(400).json(err);
      } else if (user) {
        user.verificationCode = user.generateOTP();
        user
          .save()
          .then(() => {
            // sendGrid.sendEmail(user);

            return res.status(200).json({
              message: "User authenticated successfully",
              data: user.generateJwt(),
            });
          })
          .catch((err) => {
            next(err);
          });
      } else {
        return res.status(404).json({ message: info });
      }
    })(req, res, next);
  },

  twoFactorAuthentication(req, res, next) {
    const code = req.body.verificationCode;
    const userId = req.body.userId;

    User.findOne({ __id: userId })
      .then((doc) => {
        if (doc.verificationCode == code) {
          res.status(200).json({ messsage: "User verified successfully" });
        } else {
          res.status(400).json({ message: "Incorrect verification code" });
        }
      })
      .catch((err) => {
        next(err);
      });
  },
};

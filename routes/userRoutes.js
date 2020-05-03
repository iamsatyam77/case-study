const express = require("express");
const router = express.Router();

//Jwt Helper service
const jwtHelper = require("../services/jwtHelper");

//Controllers routes
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post(
  "/twoFactorAuthenticate",
  jwtHelper.verifyJwtToken,
  userController.twoFactorAuthentication
);

module.exports = router;

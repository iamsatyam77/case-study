require("./config/config");
require("./config/db");
require("./config/jwtStrategies");

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const userRoutes = require("./routes/userRoutes");

const app = express();

//Midlleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

//Routes
app.use("/api/user", userRoutes);

// error handler
app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === "ValidationError") {
    var valErrors = [];
    Object.keys(err.errors).forEach((key) =>
      valErrors.push(err.errors[key].message)
    );
    res.status(422).json({ message: valErrors });
  } else if (err.code == 11000) {
    res.status(409).json({ message: "Email already exists!!" });
  } else {
    console.log(err);
    res.status(500).json({ message: "Something looks wrong :( !!!" });
  }
});

// start server
app.listen(process.env.PORT, () =>
  console.log(`Server started at port : ${process.env.PORT}`)
);

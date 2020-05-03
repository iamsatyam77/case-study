const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, "Please provide first name!"],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "Please provide last name!"],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(String(v).toLowerCase());
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
    required: [true, "Please provide email!"],
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        const phoneRegex = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
        return phoneRegex.test(v);
      },
      message: (props) => `${props.value} is not a valid contact number!`,
    },
    required: [true, "Please provide contact number"],
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Please provide password!"],
    min: [4, "Password must be atleast 4 characters long!"],
  },
  verificationCode: { type: String },
  saltSecret: { type: String },
  isVerified: { type: Boolean, default: false },
});

// hash user password before saving into database
userSchema.pre("save", function (next) {
  this.saltSecret = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUND));
  this.password = bcrypt.hashSync(this.password, this.saltSecret);
  next();
});

// Password verification
userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Generate Jwt token
userSchema.methods.generateJwt = function () {
  return jwt.sign(
    { email: this.email, _id: this._id },
    process.env.SECRET_KEY,
    { expiresIn: "2h" }
  );
};

userSchema.methods.generateOTP = function () {
  const DIGITS = "0123456789";
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    OTP += DIGITS[Math.floor(Math.random() * 10)];
  }
  console.log("CODEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
  return OTP;
};

module.exports = mongoose.model("User", userSchema);

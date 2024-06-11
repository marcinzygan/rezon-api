const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please provide the name"],
  },
  email: {
    type: String,
    require: [true, "Please provide your email address"],
    uniqe: true,
    lowercase: true,
    validator: [validator.isEmail, "Please provide valid email address"],
  },
  password: {
    type: String,
    require: [true, "Please provide a password"],
    minlength: 8,
  },
  passwordConfirmation: {
    type: String,
    require: [true, "Please confirm your password"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

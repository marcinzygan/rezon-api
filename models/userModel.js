const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    validate: [validator.isEmail, "Please provide valid email address"],
  },
  password: {
    type: String,
    require: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirmation: {
    type: String,
    require: [true, "Please confirm your password"],
    validate: {
      // Only works on SAVE,CREATE
      validator: function (el) {
        return el === this.password;
      },
      message: "The password did not match",
    },
  },
});

// PASSWORD ENCRYPTION MIDDLEWARE
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Generate Hash
  this.password = await bcrypt.hash(this.password, 12);
  //   delete passwordConfirmation
  this.passwordConfirmation = undefined;

  next();
});

//  COMPARE USER PASSWORDS

// Create instance method for PASSWORD COMPARE

userSchema.methods.comparePassword = async function (
  passwordToCompare,
  userPassword,
) {
  return await bcrypt.compare(passwordToCompare, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;

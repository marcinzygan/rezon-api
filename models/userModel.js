const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the name"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email address"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide valid email address"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordConfirmation: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // Only works on SAVE,CREATE
      validator: function (el) {
        return el === this.password;
      },
      message: "The password did not match",
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetTokenExpiresAt: Date,
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

// MIDDLEWARE TO UPDATE passwordChangedAt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
// MIDDLEWARE TO EXCLUDE INACTIVE USERS FROM SHOWING IN RESULTS
userSchema.pre(/^find/, async function (next) {
  //this points to current query
  this.find({ active: true });
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
//  CHECK IF USER CHANGED PASSWORD

// Create instance method for PASSWORD CHANGE

userSchema.methods.checkIfPasswordChanged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    // console.log(
    //   JWTTimestamp < changedTimestamp,
    //   JWTTimestamp,
    //   changedTimestamp,
    // );
    return JWTTimestamp < changedTimestamp;
  }

  // False means password was not changed
  return false;
};
// SEND PASSWORD RESET TOKEN
userSchema.methods.sendPasswordResetToken = function () {
  const passwordToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(passwordToken)
    .digest("hex");
  this.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000;

  // console.log(passwordToken, this.passwordResetToken);
  return passwordToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

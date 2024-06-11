const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const AppError = require("../utils/appError");

// GENERATE JWT TOKEN

const generateJwtToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// NEW USER SIGNUP
exports.signupUser = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
    });
    // JWT token
    const token = generateJwtToken(newUser._id);

    res.status(201).json({
      status: "success",
      token: token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

// LOGIN USER

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // 1) Check if email password exist in DB
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    // 2) Check if user exists & password is correct
    const user = await User.findOne({ email }).select("+password");

    // console.log(user, password);

    // instance method from User model
    const isPasswordCorrect = await user.comparePassword(
      password,
      user.password,
    );
    // console.log(isPasswordCorrect);

    // 3) If all s ok send JWT token to client
    if (user && isPasswordCorrect) {
      // generate token
      const token = generateJwtToken(user._id);
      res.status(200).json({
        status: "success",
        token: token,
      });
    } else {
      return next(
        new AppError(
          "There was an error with authentication: Incorrect email or password",
          401,
        ),
      );
    }
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

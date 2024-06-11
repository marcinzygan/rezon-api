const User = require("../models/userModel");
const AppError = require("../utils/appError");

// NEW USER SIGNUP
exports.signupUser = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
    });
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

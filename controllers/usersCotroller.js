const User = require("../models/userModel");
const AppError = require("../utils/appError");

// GET ALL USERS
exports.getAllUsers = async (req, res, next) => {
  try {
    // BUILD QUERY
    const users = await User.find(req.query);
    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      numberOfUsers: users.length,
      data: {
        users: users,
      },
    });
    // ERROR HANDLING
  } catch (err) {
    next(new AppError(err.message, 404));
  }
};

// UPDATE CURRENT USER
exports.updateMe = async (req, res, next) => {
  try {
    // 1) Create error if user POST password data
    if (req.body.password || req.body.passwordConfirmation) {
      return next(
        new AppError(
          "Please use /update-my-password in order to change your password",
          400,
        ),
      );
    }
    // 2 ) Update user data

    const user = await User.findById(req.user._id);
    if (req.body.name) {
      user.name = req.body.name;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    // validate only modified data
    await user.save({ validateModifiedOnly: true });
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(new AppError(err.message, 404));
  }
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not implemented yet",
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not implemented yet",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not implemented yet",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not implemented yet",
  });
};

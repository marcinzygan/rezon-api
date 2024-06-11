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

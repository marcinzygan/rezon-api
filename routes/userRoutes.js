const express = require("express");

const userRouter = express.Router();

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersCotroller");

const {
  signupUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// USERS ROUTES

// User Signup
userRouter.route("/signup").post(signupUser);
// Login User
userRouter.route("/login").post(loginUser);
// Forgot Password
userRouter.route("/forgot-password").post(forgotPassword);
// Reset Password
userRouter.route("/reset-password").post(resetPassword);
// Main route
userRouter.route("/").get(getAllUsers).post(createUser);

// Users by id
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRouter;

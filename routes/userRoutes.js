const express = require("express");

const userRouter = express.Router();

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersCotroller");

const authController = require("../controllers/authController");

// USERS ROUTES

// User Signup
userRouter.route("/signup").post(authController.signupUser);
// Login User
userRouter.route("/login").post(authController.loginUser);
// Forgot Password
userRouter.route("/forgot-password").post(authController.forgotPassword);
// Reset Password
userRouter.route("/reset-password/:token").patch(authController.resetPassword);
// Update Password
userRouter
  .route("/update-password")
  .patch(authController.protect, authController.updatePassword);

// Main route
userRouter
  .route("/")
  .get(authController.protect, authController.restrictTo("admin"), getAllUsers)
  .post(createUser);

// Users by id
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRouter;

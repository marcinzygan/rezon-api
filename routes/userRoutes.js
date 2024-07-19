const express = require("express");

const userRouter = express.Router();

const usersCotroller = require("../controllers/usersCotroller");

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
// Get info about currently logged in user
userRouter.route("/get-me").get(authController.protect, usersCotroller.getMe);
// Update Password
userRouter
  .route("/update-my-password")
  .patch(authController.protect, authController.updateMyPassword);
userRouter
  .route("/update-me")
  .patch(authController.protect, usersCotroller.updateMe);
userRouter
  .route("/delete-me")
  .delete(authController.protect, usersCotroller.deleteMe);

// Main route
userRouter
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    usersCotroller.getAllUsers,
  )
  .post(usersCotroller.createUser);

// Users by id
userRouter
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    usersCotroller.getUser,
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    usersCotroller.updateUser,
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    usersCotroller.deleteUser,
  );

module.exports = userRouter;

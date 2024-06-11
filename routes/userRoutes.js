const express = require("express");

const userRouter = express.Router();

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersCotroller");

const { signupUser, loginUser } = require("../controllers/authController");

// USERS ROUTES

// User Signup
userRouter.route("/signup").post(signupUser);
// Login User
userRouter.route("/login").post(loginUser);

userRouter.route("/").get(getAllUsers).post(createUser);

// Users by id
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRouter;

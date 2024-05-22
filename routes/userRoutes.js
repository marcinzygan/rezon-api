const express = require("express");
const userRouter = express.Router();
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersCotroller");
// USERS ROUTES

userRouter.route("/").get(getAllUsers).post(createUser);

// Users by id
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRouter;

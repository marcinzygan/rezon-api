const express = require("express");
const userRouter = express.Router();

// user handlers
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not implemented yet",
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not implemented yet",
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not implemented yet",
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not implemented yet",
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route is not implemented yet",
  });
};

// USERS ROUTES

userRouter.route("/").get(getAllUsers).post(createUser);

// Users by id
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRouter;

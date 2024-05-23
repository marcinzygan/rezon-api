const express = require("express");
const productRouter = express.Router();

const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  checkID,
  checkBody,
} = require("../controllers/productsController");

// MIDDLEWARE FOR PRODUCTS ROUTE to check if id is valid
productRouter.param("id", checkID);

// PRODUCT MAIN ROUTE
productRouter.route("/").get(getAllProducts).post(checkBody, createProduct);

// PRODUCT ROUTE TO GET PATCH DELETE PRODUCT BY ID
productRouter
  .route("/:id")
  .get(getProduct)
  .patch(checkBody, updateProduct)
  .delete(deleteProduct);

module.exports = productRouter;

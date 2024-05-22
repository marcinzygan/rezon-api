const express = require("express");
const productRouter = express.Router();

const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");

// PRODUCT MAIN ROUTE
productRouter.route("/").get(getAllProducts).post(createProduct);

// PRODUCT ROUTE TO GET PATCH DELETE PRODUCT BY ID
productRouter
  .route("/:id")
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = productRouter;

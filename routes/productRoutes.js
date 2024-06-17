const express = require("express");

const productRouter = express.Router();

const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsStats,
  getCategories,
} = require("../controllers/productsController");

const { protect, restrictTo } = require("../controllers/authController");

// GET CATEGORIES
productRouter.route("/categories").get(getCategories);
// GET PRODUCT STATS ROUTE
productRouter.route("/stats").get(getProductsStats);

// PRODUCT MAIN ROUTE
productRouter
  .route("/")
  .get(protect, getAllProducts)
  .post(protect, restrictTo("admin"), createProduct);

// PRODUCT ROUTE TO GET PATCH DELETE PRODUCT BY ID
productRouter
  .route("/:id")
  .get(getProduct)
  .patch(protect, restrictTo("admin"), updateProduct)
  .delete(protect, restrictTo("admin"), deleteProduct);

module.exports = productRouter;

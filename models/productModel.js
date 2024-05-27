const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  pc_id: {
    type: String,
    required: [true, "Please provide product pc_id"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please provide product name"],
    unique: true,
  },
  category: {
    type: String,
    required: [true, "Please provide product category"],
  },
  price: {
    type: Number,
    required: [true, "Please provide product price"],
  },
  description: String,
  image: String,
  slider_images: Array,
  technology: String,
  stock: Number,
  stock_optimal: Number,
  dimensions: String,
  new: Boolean,
  active: Boolean,
  custom_shape: Boolean,
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;

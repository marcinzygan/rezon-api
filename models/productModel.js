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
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "Please provide product image path"],
  },
  images: [String],
  technology: Number,
  stock: Number,
  stock_optimal: Number,
  stock_ordered: Number,
  stock_additional: Object,
  dimensions: String,
  new: Boolean,
  active: {
    type: Boolean,
    required: [true, "Please specify if product is active"],
  },
  custom_shape: Boolean,
  form: String,
  catalogue: String,
  compilation: Boolean,
  compilation_desc: String,
  compilation_quantity: Number,
  compilation_price: Number,
  stand: Boolean,
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;

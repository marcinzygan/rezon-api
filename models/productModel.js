const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  pc_id: {
    type: String,
    required: [true, "Please provide product pc_id"],
    maxlength: [40, "The pc_id should have maximum of 40 characters"],
  },
  name: {
    type: String,
    required: [true, "Please provide product name"],
    maxlength: [40, "The pc_id should have maximum of 40 characters"],
    unique: true,
  },
  slug: String,
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
    default: true,
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

// DOCUMENT MIDDLEWARE

// runs before .save() and .create() command
// use normal function not arrow function to have acces to "this" keyword
productSchema.pre("save", function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE

// productSchema.pre(/^find/, function (next) {
//   // "this" keyword will point to current query
//   this.find({ active: { $ne: false } });
//   next();
// });

// AGGREGATION MIDDLEWARE

// "this" keyword will point to current aggregation object
// productSchema.pre("aggregate", function (next) {
//   console.log(this);
//   next();
// });
const Product = mongoose.model("Product", productSchema);

module.exports = Product;

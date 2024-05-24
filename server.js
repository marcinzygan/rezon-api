const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
//ENV config
dotenv.config({ path: "./config.env" });
// CONENCT TO DATABASE
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB, {}).then(() => {
  console.log("DB connection sucesfull");
});
const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
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

const testProduct = new Product({
  id: 4,
  pc_id: "Test PRODUCT 3",
  name: "Test product 3",
  category: "magnesy",
  price: 9,
  description:
    "Magnes wykonany z wyciętego akrylu w kształcie dowolnym. Możliwe nadrukowanie grafiki na powstałym kształcie.",
  image: "/images/magnesy/01.jpg",
  slider_images: ["/images/magnesy/01.jpg"],
  technology: "1",
  stock: 120,
  stock_optimal: 100,
  dimensions: "dowolny",
  new: false,
  active: true,
  custom_shape: true,
});
testProduct
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log("Error", err);
  });
const port = process.env.PORT || 8000;
// APP START
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});

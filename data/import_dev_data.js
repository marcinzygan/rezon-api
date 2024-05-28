const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ProductModel = require("../models/productModel");

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

// Read JSON file

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/productData.json`, "utf-8"),
);

// Import data to DB

const importData = async () => {
  try {
    await ProductModel.create(products);
    console.log("Data successfully imported!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all data from collection

const deleteAllData = async () => {
  try {
    await ProductModel.deleteMany();
    console.log("Colletcon deleted successfully");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteAllData();
}
console.log(process.argv);

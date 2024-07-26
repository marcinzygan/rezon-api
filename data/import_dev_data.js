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

const products = JSON.parse(fs.readFileSync(`${__dirname}/tes.json`, "utf-8"));
console.log(products);
// DELETE a certain fields from json file
// async function deleteFields() {
//   products.forEach(function (obj) {
//     delete obj._id;
//     delete obj.createdAt;
//   });
// }

// deleteFields();

// fs.writeFile(
//   `${__dirname}/tes.json`,
//   JSON.stringify(products),
//   "utf-8",
//   (err) => {
//     console.log(err);
//   },
// );

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
    await ProductModel.deleteMany({ displayCategory: { $ne: true } });
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

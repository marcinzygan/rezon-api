const fs = require("fs");
const express = require("express");

const app = express();
const port = 8000;

// Read product data once top lvl code
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/data/productData.json`, "utf-8")
);

app.get("/api/v1/products", (req, res) => {
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products: products,
    },
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});

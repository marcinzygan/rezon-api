const fs = require("fs");
const express = require("express");

const app = express();
const port = 8000;

// MIDDLEWARE
app.use(express.json());

// READ PRODUCT DATA
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/data/testProducts.json`)
);

// GET REQUEST
app.get("/api/v1/products", (req, res) => {
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products: products,
    },
  });
});
// GET REQUEST for ID
app.get("/api/v1/products/:id", (req, res) => {
  // convert param id to number
  const id = req.params.id * 1;
  // find product by id
  const product = products.find((product) => product.id === id);
  if (!product) {
    return res.status(404).json({
      status: "fail",
      message: `Could not find the product with id:${id}`,
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      product: product,
    },
  });
});
// POST REQUEST
app.post("/api/v1/products", (req, res) => {
  const newId = products[products.length - 1].id + 1;
  const newProduct = Object.assign({ id: newId }, req.body);
  // add new product to poroducts array
  products.push(newProduct);
  // Wrtie new products array to file async , convert products array to JSON
  fs.writeFile(
    `${__dirname}/data/testProducts.json`,
    JSON.stringify(products),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          product: newProduct,
        },
      });
    }
  );
});

// APP START
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});

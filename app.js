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

const getAllProducts = (req, res) => {
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products: products,
    },
  });
};
const getProduct = (req, res) => {
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
};
const createProduct = (req, res) => {
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
};
const updateProduct = (req, res) => {
  if (req.params.id * 1 > products.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      product: "Updated Product here",
    },
  });
};
const deleteProduct = (req, res) => {
  if (req.params.id * 1 > products.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id",
    });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};

//  ROUTES FOR GET AND POST REQUEST
app.route("/api/v1/products").get(getAllProducts).post(createProduct);

// ROUTES FOR GET PATCH DELETE PRODUCT BY ID
app
  .route("/api/v1/products/:id")
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

// APP START
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});

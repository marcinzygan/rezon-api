const express = require("express");
const fs = require("fs");
const productRouter = express.Router();

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/testProducts.json`)
);

const getAllProducts = (req, res) => {
  res.status(200).json({
    requestedAt: req.requestTime,
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

// PRODUCT MAIN ROUTE
productRouter.route("/").get(getAllProducts).post(createProduct);

// PRODUCT ROUTE TO GET PATCH DELETE PRODUCT BY ID
productRouter
  .route("/:id")
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = productRouter;

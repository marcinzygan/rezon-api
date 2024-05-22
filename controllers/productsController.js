const fs = require("fs");

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/testProducts.json`)
);

// GET ALL PRODUCTS
exports.getAllProducts = (req, res) => {
  res.status(200).json({
    requestedAt: req.requestTime,
    status: "success",
    results: products.length,
    data: {
      products: products,
    },
  });
};

//  GET PRODUCT BY ID
exports.getProduct = (req, res) => {
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

//CREATE PRODUCT
exports.createProduct = (req, res) => {
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

// UPDATE PRODUCT BY ID
exports.updateProduct = (req, res) => {
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
// DELETE PRODUCT BY ID
exports.deleteProduct = (req, res) => {
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

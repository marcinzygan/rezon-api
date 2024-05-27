const Product = require("../models/productModel");

// GET ALL PRODUCTS
exports.getAllProducts = (req, res) => {
  res.status(200).json({
    // requestedAt: req.requestTime,
    // status: "success",
    // results: products.length,
    // data: {
    //   products: products,
    // },
  });
};

//  GET PRODUCT BY ID
exports.getProduct = (req, res) => {
  // convert param id to number
  const id = req.params.id * 1;
  // find product by id
  // const foundProduct = products.find((product) => product.id === id);

  res.status(200).json({
    status: "success",
    data: {
      product: foundProduct,
    },
  });
};

//CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        product: newProduct,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// UPDATE PRODUCT BY ID
exports.updateProduct = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      product: "Updated Product here",
    },
  });
};
// DELETE PRODUCT BY ID
exports.deleteProduct = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};

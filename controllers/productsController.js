const Product = require("../models/productModel");

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      status: "success",
      data: {
        products: products,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

//  GET PRODUCT BY ID
exports.getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    // F ind product by search parameter
    const foundProduct = await Product.findOne({ _id: id });
    //  Product.findById(id) to search by mongoDB _id
    res.status(200).json({
      status: "success",
      data: {
        product: foundProduct,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
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

const Product = require("../models/productModel");

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
    console.log(req.query);
    let products;
    if (req.query.name) {
      const { name } = req.query;
      // create regex to find product by name not case sesitive
      const regex = new RegExp(name, "i");
      console.log(regex);
      const queryObj = { ...req.query };
      products = await Product.find({ name: regex });
    } else {
      products = await Product.find();
    }

    res.status(200).json({
      status: "success",
      numberOfProducts: products.length,
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
    // Find product by search parameter
    const foundProduct = await Product.findById(req.params.id);
    // const foundProduct = await Product.findOne({ _id: id });

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
    // Create new product
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
exports.updateProduct = async (req, res) => {
  try {
    // Find product by id and update
    const foundProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        // options to return new updated product
        new: true,
        // run validators
        runValidators: true,
      },
    );
    res.status(200).json({
      status: "success",
      data: {
        product: foundProduct,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
// DELETE PRODUCT BY ID
exports.deleteProduct = async (req, res) => {
  try {
    // delete product by id
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

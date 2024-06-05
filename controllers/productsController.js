const Product = require("../models/productModel");
const APIFeatures = require("../utils/apiFeatures");

//////// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
    // BUILD QUERY
    const features = new APIFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // EXECUTE QUERY
    const products = await features.query;
    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      numberOfProducts: products.length,
      data: {
        products: products,
      },
    });
    // ERROR HANDLING
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

////////  GET PRODUCT BY ID
exports.getProduct = async (req, res) => {
  try {
    console.log(req.query);
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
      message: err.message,
    });
  }
};

//////// CREATE PRODUCT
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
      message: err.message,
    });
  }
};

//////// UPDATE PRODUCT BY ID
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
      message: err.message,
    });
  }
};
//////// DELETE PRODUCT BY ID
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
      message: err.message,
    });
  }
};
// PRODUCTS STATS

exports.getProductsStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          numProducts: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats: stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

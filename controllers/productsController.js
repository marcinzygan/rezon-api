const Product = require("../models/productModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");

//////// GET ALL PRODUCTS
exports.getAllProducts = async (req, res, next) => {
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
    // res.status(404).json({
    //   status: "fail",
    //   message: err.message,
    // });
    next(new AppError(err.message, 404));
  }
};

////////  GET PRODUCT BY ID
exports.getProduct = async (req, res, next) => {
  try {
    // Find product by search parameter
    const foundProduct = await Product.findById(req.params.id);

    // If there is no product show error , always return , to not show two responses.
    if (!foundProduct) {
      return next(new AppError(`could not find the id: ${req.params.id}`, 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        product: foundProduct,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 404));
  }
};

//////// CREATE PRODUCT
exports.createProduct = async (req, res, next) => {
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
    next(new AppError(err.message, 400));
  }
};

//////// UPDATE PRODUCT BY ID
exports.updateProduct = async (req, res, next) => {
  try {
    // Find product by id and update
    const foundProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        // options to return new updated product
        new: true,
        // run validators again to validate the incoming data
        runValidators: true,
      },
    );
    // If there is no product show error , always return , to not show two responses.
    if (!foundProduct) {
      return next(new AppError(`could not find the id: ${req.params.id}`, 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        product: foundProduct,
      },
    });
  } catch (err) {
    // res.status(400).json({
    //   status: "fail",
    //   message: err.message,
    // });
    next(new AppError(err.message, 400));
  }
};
//////// DELETE PRODUCT BY ID
exports.deleteProduct = async (req, res, next) => {
  try {
    // delete product by id
    const foundProduct = await Product.findByIdAndDelete(req.params.id);

    // If there is no product show error , always return , to not show two responses.
    if (!foundProduct) {
      return next(new AppError(`could not find the id: ${req.params.id}`, 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    // res.status(400).json({
    //   status: "fail",
    //   message: err.message,
    // });
    next(new AppError(err.message, 400));
  }
};
// PRODUCTS STATS

exports.getProductsStats = async (req, res, next) => {
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
    // res.status(400).json({
    //   status: "fail",
    //   message: err.message,
    // });
    next(new AppError(err.message, 400));
  }
};

// LIST CATEGORIES

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
        },
        $sort: { category: 1 },
      },
      { $addFields: { category: "$_id" } },
      { $project: { _id: 0 } },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        categories: categories,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

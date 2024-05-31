const Product = require("../models/productModel");

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
    // make copy of original query Object to avoid mutating original query
    const queryObj = { ...req.query };

    //FILTER QUERY
    // 1 Filtering

    // loop over query object and delete the excluded fields
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    console.log(req.query, queryObj);

    // 2) Advanced filtering
    // convert queryObj to string
    let queryStr = JSON.stringify(queryObj);
    // add $ in front of the matched expression
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    console.log(JSON.parse(queryStr));

    // BUILD QUERY
    let products;
    if (JSON.parse(queryStr).search) {
      const { search } = JSON.parse(queryStr);
      // create regex to find product by search param not case sesitive
      const regex = new RegExp(search, "i");

      // build new query object to search product either by name or pc_id
      const newObj = { ...JSON.parse(queryStr) };
      const excludeSearchField = ["search"];
      excludeSearchField.forEach((el) => delete newObj[el]);

      const newQuery = {
        $or: [{ name: regex }, { pc_id: regex }],
        $and: [{ ...newObj }],
      };

      console.log(regex, newQuery);
      const query = Product.find(newQuery);

      // EXECUTE QUERY
      products = await query;
    } else {
      // BUILD QUERY
      const query = Product.find(JSON.parse(queryStr));

      // EXECUTE QUERY
      products = await query;
    }
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

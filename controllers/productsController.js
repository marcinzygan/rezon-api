const Product = require("../models/productModel");

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
    // make copy of original query Object to avoid mutating original query
    const queryObj = { ...req.query };

    //FILTER QUERY
    // 1 FILTERING

    // loop over query object and delete the excluded fields
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 2) ADVANCED FILTERING
    // convert queryObj to string
    let queryStr = JSON.stringify(queryObj);
    // add $ in front of the matched expression
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // BUILD QUERY
    // let products;
    let query = Product.find(JSON.parse(queryStr));

    if (JSON.parse(queryStr).search) {
      // query example search=magnes or search=magnes&price[gte]=5
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

      query = Product.find(newQuery);
    }
    // 3) SORTING PRODUCTS
    if (req.query.sort) {
      // query example: sort=price
      query = query.sort(req.query.sort);
      console.log(req.query);
    } else {
      query = query.sort("-createdAt");
    }
    //  4) FIELD LIMITING
    if (req.query.fields) {
      // example: fields=name+pc_id+price
      console.log(req.query.fields);
      query = query.select(req.query.fields);
    } else {
      //default exclude the fields
      query = query.select("-__v");
    }
    // EXECUTE QUERY
    const products = await query;
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

const Product = require("../models/productModel");

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
    // make copy of original query Object to avoid mutating original query
    const queryObj = { ...req.query };

    //FILTER QUERY

    // loop over query object and delete the excluded fields
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    console.log(req.query, queryObj);

    let products;
    if (queryObj.search) {
      // BUILD QUERY

      const { search } = queryObj;
      // create regex to find product by name not case sesitive
      const regex = new RegExp(search, "i");
      // create regex to find product by pc_id not case sesitive

      // build new query object
      const newQuery = {
        $or: [{ name: regex }, { pc_id: regex }],
      };
      console.log(regex, queryObj, newQuery);
      const query = Product.find(newQuery);

      // let query = {};
      // query = {
      //   $or: [
      //     { name: { $regex: queryObj, $options: "i" } },
      //     { pc_id: { $regex: queryObj, $options: "i" } },
      //   ],
      // };
      // const queryProd = Product.find(query);
      // EXECUTE QUERY
      products = await query;
    } else {
      // BUILD QUERY
      const query = Product.find(queryObj);

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

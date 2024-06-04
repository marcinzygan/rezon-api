const Product = require("../models/productModel");

class APIFeatures {
  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
  }

  // FILTER METHOD
  filter() {
    // make copy of original query Object to avoid mutating original query
    const queryObj = { ...this.queryObject };

    // loop over query object and delete the excluded fields
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // convert queryObj to string
    let queryStr = JSON.stringify(queryObj);

    // add $ in front of the matched expression
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    //SEARCH FEATURE
    // query example: ?search=magnes or ?search=magnes&price[gte]=5
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

      this.query = this.query.find(newQuery);
    } else {
      this.query = this.query.find(JSON.parse(queryStr));
    }
    return this;
  }

  // SORT METHOD
  // query example: ?sort=price
  sort() {
    if (this.queryObject.sort) {
      this.query = this.query.sort(this.queryObject.sort);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  // LIMIT METHOD
  // query example: ?fields=name+pc_id+price
  limit() {
    if (this.queryObject.fields) {
      this.query = this.query.select(this.queryObject.fields);
    } else {
      //default exclude the fields
      this.query = this.query.select("-__v");
    }
    return this;
  }

  // 5) PAGINATION METHOD
  // query example: ?page=2&limit=100
  paginate() {
    //  1-100 is page 1
    const page = this.queryObject.page * 1 || 1;
    const limit = this.queryObject.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

//////// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
    // BUILD QUERY
    const features = new APIFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .limit()
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
      message: err,
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
      message: err,
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
      message: err,
    });
  }
};

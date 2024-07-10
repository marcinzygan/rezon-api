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

    //SEARCH FEATURE.
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
      this.query = this.query.sort({ category: 1, createdAt: 1, new: -1 });
    }
    return this;
  }

  // LIMIT METHOD
  // query  example: ?fields=name+pc_id+price
  limitFields() {
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
    const limit = this.queryObject.limit * 1 || 0;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

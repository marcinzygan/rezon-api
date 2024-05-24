👋 Hi, I’m @marcinzygan

# This is RESTful API for products for Rezon.eu built with Node.js, Express, MongoDB, Mongoose"

# Rezon Product API

Welcome to the Rezon Product API. This API allows you to manage products in a database. Below are the details of the available routes and the product schema.

## Product Schema

```javascript
const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  pc_id: {
    type: String,
    required: [true, "Please provide product pc_id"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please provide product name"],
    unique: true,
  },
  category: {
    type: String,
    required: [true, "Please provide product category"],
  },
  price: {
    type: Number,
    required: [true, "Please provide product price"],
  },
  description: String,
  image: String,
  slider_images: Array,
  technology: String,
  stock: Number,
  stock_optimal: Number,
  dimensions: String,
  new: Boolean,
  active: Boolean,
  dowolny_ksztalt: Boolean,
});
```

## Base URL

/api/v1/products

## Endpoints

### 1 Get All Products

- **Route:** `/api/v1/products`
- **Method:** `GET`
- **Description:** Retrieves a list of all products.
- **Response:** JSON array of product objects.

#### Example:

```javascript
fetch("/api/v1/products")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

#### Example Response:

```json
[
  {
    "id": 1,
    "pc_id": "PC001",
    "name": "Product 1",
    "category": "Category 1",
    "price": 100,
    "description": "Description of Product 1",
    "image": "image1.jpg",
    "slider_images": ["img1.jpg", "img2.jpg"],
    "technology": "Tech 1",
    "stock": 50,
    "stock_optimal": 100,
    "dimensions": "10x10x10",
    "new": true,
    "active": true,
    "dowolny_ksztalt": false
  },
  ...
]

```

### 2 Create a New Product

- **Route:** `/api/v1/products`
- **Method:** `POST`
- **Description:** Create a new product.

#### Example Request:

```javascript
const newProduct = {
  pc_id: "PC002",
  name: "Product 2",
  category: "Category 2",
  price: 200,
  description: "Description of Product 2",
  image: "image2.jpg",
  slider_images: ["img3.jpg", "img4.jpg"],
  technology: "Tech 2",
  stock: 30,
  stock_optimal: 60,
  dimensions: "20x20x20",
  new: false,
  active: true,
  dowolny_ksztalt: true,
};

fetch("/api/v1/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newProduct),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

#### Example Response:

```json
{
  "message": "Product created successfully",
  "product": {
    "id": 2,
    "pc_id": "PC002",
    "name": "Product 2",
    "category": "Category 2",
    "price": 200,
    "description": "Description of Product 2",
    "image": "image2.jpg",
    "slider_images": ["img3.jpg", "img4.jpg"],
    "technology": "Tech 2",
    "stock": 30,
    "stock_optimal": 60,
    "dimensions": "20x20x20",
    "new": false,
    "active": true,
    "dowolny_ksztalt": true
  }
}
```

### 3 Get a Product by ID

- **Route:** `/api/v1/products/:id`
- **Method:** `GET`
- **Description:** Retrieve a product by its ID.

#### Example Request:

```javascript
const productId = 1;

fetch(`/api/v1/products/${productId}`)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

#### Example Response:

```json
{
  "id": 1,
  "pc_id": "PC001",
  "name": "Product 1",
  "category": "Category 1",
  "price": 100,
  "description": "Description of Product 1",
  "image": "image1.jpg",
  "slider_images": ["img1.jpg", "img2.jpg"],
  "technology": "Tech 1",
  "stock": 50,
  "stock_optimal": 100,
  "dimensions": "10x10x10",
  "new": true,
  "active": true,
  "dowolny_ksztalt": false
}
```

### 4 Update a Product by ID

- **Route:** `/api/v1/products/:id`
- **Method:** `POST`
- **Description:** Update an existing product by its ID.

#### Example Request:

```javascript
const productId = 1;
const updatedProduct = {
  name: "Updated Product 1",
  price: 120,
};

fetch(`/api/v1/products/${productId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(updatedProduct),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

#### Example Response:

```json
{
  "message": "Product updated successfully",
  "product": {
    "id": 1,
    "pc_id": "PC001",
    "name": "Updated Product 1",
    "category": "Category 1",
    "price": 120,
    "description": "Description of Product 1",
    "image": "image1.jpg",
    "slider_images": ["img1.jpg", "img2.jpg"],
    "technology": "Tech 1",
    "stock": 50,
    "stock_optimal": 100,
    "dimensions": "10x10x10",
    "new": true,
    "active": true,
    "dowolny_ksztalt": false
  }
}
```

### 5 Delete a Product by ID

- **Route:** `/api/v1/products/:id`
- **Method:** `DELETE`
- **Description:** Delete a product by its ID.

#### Example Request:

```javascript
const productId = 1;

fetch(`/api/v1/products/${productId}`, {
  method: "DELETE",
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

#### Example Response:

```json
{
  "message": "Product deleted successfully"
}
```

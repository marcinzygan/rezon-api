const morgan = require("morgan");
const express = require("express");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();

const port = 8000;

// MIDDLEWARE
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// ROUTE HANDLERS

//// ROUTES

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);

// APP START
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});

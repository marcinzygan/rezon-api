const morgan = require("morgan");
const express = require("express");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();

// MIDDLEWARE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// ROUTE HANDLERS

//// ROUTES

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;

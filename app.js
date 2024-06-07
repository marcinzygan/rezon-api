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

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   console.log(req.requestTime);
//   next();
// });

// ROUTE HANDLERS

//// ROUTES

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);

//// UNHANDLED ROUTES
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server. Please check documentation for available routes.`,
  });
  next();
});

module.exports = app;

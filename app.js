const morgan = require("morgan");
const express = require("express");
const rateLimit = require("express-rate-limit");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const errorController = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

// GLOBAL MIDDLEWARE
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //1hr
  message: "Too many request with this IP. Please try again in an hour",
});
app.use("/api", limiter);

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.requestTime, req.headers);
  next();
});

// ROUTE HANDLERSss

//// ROUTES

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);

//// UNHANDLED ROUTES
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server. Please check documentation for available routes.`,
      404,
    ),
  );
});

//// ERROR HANDLING MIDDLEWARE
app.use(errorController);

module.exports = app;

const morgan = require("morgan");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const errorController = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

////// GLOBAL MIDDLEWARE
// CORS
app.use(
  cors({
    credentials: true,
    origin: [
      process.env.HOSTNAME,
      "https://rezon-katalog.netlify.app/",
      "http://localhost:3000",
    ],
  }),
);
// SET HTTP HEADERS
app.use(helmet());

// DEVELOPMNENT LOGGING
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// LIMIT REQUEST FROM SAME IP
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000, //1hr
  message: "Too many request with this IP. Please try again in an hour",
});
app.use("/api", limiter);

// BODY PARSER , reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(
  cookieParser("test", {
    sameSite: "none",
    httpOnly: false,
    secure: false,
    maxAge: 900000,
  }),
);
// DATA SANITAZATION AGAINST NOSQL DATA INJECTON
app.use(mongoSanitize());

// DATA SANITAZATION AGAINST NOSQL XSS
app.use(xss());

// PREVENT PARAMETER POLUTION
app.use(hpp());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);

  next();
});

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

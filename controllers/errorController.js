// SEND ERROR IN DEVELOPMENT

const sendErrorDev = function (err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
// SEND ERROR IN PRODUCTION

const sendErrorProduction = function (err, res) {
  // Operational trusted error : send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or unknown error : don't want to leak error details to client

    //1) Log error
    console.err("ERROR:", err);

    //2) Send generic message
    res.status(500).json({
      status: "error",
      message: "There was an error",
    });
  }
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProduction(err, res);
  }

  next();
};

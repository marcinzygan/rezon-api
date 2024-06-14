const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

// GENERATE JWT TOKEN

const generateJwtToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// NEW USER SIGNUP
exports.signupUser = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation,
    });
    // JWT token
    const token = generateJwtToken(newUser._id);

    res.status(201).json({
      status: "success",
      token: token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

// LOGIN USER

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // 1) Check if email password exist in DB
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    // 2) Check if user exists & password is correct
    const user = await User.findOne({ email }).select("+password");

    // console.log(user, password);
    // If there in no user return AppError
    if (!user) {
      return next(
        new AppError(
          "There was an error with authentication: Incorrect email or password",
          401,
        ),
      );
    }
    // instance method from User model
    const isPasswordCorrect = await user.comparePassword(
      password,
      user.password,
    );
    // console.log(isPasswordCorrect);

    // 3) If all s ok send JWT token to client
    if (user && isPasswordCorrect) {
      // generate token
      const token = generateJwtToken(user._id);
      res.status(200).json({
        status: "success",
        token: token,
      });
    } else {
      return next(
        new AppError(
          "There was an error with authentication: Incorrect email or password",
          401,
        ),
      );
    }
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    // 1) Get token from req.headers , check if token exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // check if token exists
    if (!token) {
      return next(
        new AppError("Please log in in order to access this resource", 401),
      );
    }
    // 2) Token verification asynchronously
    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET,
    );

    // 3) Check if user still exists
    const user = await User.findById(decodedToken.id);
    console.log(user);
    if (!user) {
      return next(
        new AppError("Unauthorized access: this user no longer exist", 401),
      );
    }
    // 4) Check if user changed password after token was issued

    if (user.checkIfPasswordChanged(decodedToken.iat)) {
      return next(new AppError("Unauthorized access: please login again", 401));
    }

    req.user = user;

    next();
    // 5) If all above if passed call next() and give access to protected route.
    // console.log(decodedToken, token);
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

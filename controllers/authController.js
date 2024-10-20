const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/nodemailer");

// GENERATE JWT TOKEN

const generateJwtToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
// CREATE RESPONSE AND SEND TOKEN FUNCTION

const createSendToken = (user, statusCode, res) => {
  const token = generateJwtToken(user._id);
  // Create Cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    Domain: "https://www.rezon.eu",
    sameSite: "none",
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // send cookie
  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token: token,
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
    // Create and send JWT token
    createSendToken(newUser, 201, res);
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
      // Create and send JWT token

      createSendToken(user, 200, res);
      // generate token
      // const token = generateJwtToken(user._id);
      // res.status(200).json({
      //   status: "success",
      //   token: token,
      // });
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
    // console.log(user);
    if (!user) {
      return next(
        new AppError("Unauthorized access: this user no longer exist", 401),
      );
    }
    // 4) Check if user changed password after token was issued

    if (user.checkIfPasswordChanged(decodedToken.iat)) {
      return next(
        new AppError(
          "Unauthorized access: user recently changed password! Please log in again.",
          401,
        ),
      );
    }
    // 5) If all above if passed call next() and give access to protected route.
    req.user = user;

    next();

    // console.log(decodedToken, token);
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
};

// RESTRICT ROUTES TO "ADMIN"
exports.restrictTo = (role) => {
  return (req, res, next) => {
    console.log(role, req.user.role);
    if (role !== req.user.role) {
      return next(
        new AppError(
          "You do not have a permission to perform this acction.",
          403,
        ),
      );
    }

    next();
  };
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res, next) => {
  // 1) Get user from POST email
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new AppError("There is no user with this email adress", 404));
  }
  console.log(user);
  try {
    // 2) Generate random reset token
    const resetToken = user.sendPasswordResetToken();
    //  save user document to DB
    await user.save();
    // 3) Send token back as an email
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/reset-password/${resetToken}`;
    await sendEmail({
      email: user.email,
      subject: "Password reset for Rezon API",
      message: `Please use provided token to reset your password.  Please use this link in order to reset your password: ${resetURL} This link is only valid for 10 minutes.`,
    });
    res.status(200).json({
      status: "success",
      message: "Token send to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    await user.save();
    return next(
      new AppError(
        "There was an error sending email, please try again later!",
        500,
      ),
    );
  }
};
// RESET PASSWORD
exports.resetPassword = async (req, res, next) => {
  try {
    // 1) Get user based on token provided in params
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    // find user ind DB based on hased token and check if reset token is not expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpiresAt: { $gt: Date.now() },
    });
    console.log(user);
    if (!user) {
      return next(
        new AppError(
          "There was an error : Your reset token has expired , please try again!",
          400,
        ),
      );
    }

    // 2) If token is not expired and user exists , set new password
    user.password = req.body.password;
    user.passwordConfirmation = req.body.passwordConfirmation;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    await user.save();
    // 3) Update passwordChangedAt for current user
    // 4) Log user in , send JWT token

    // Create and send JWT token
    createSendToken(user, 201, res);
    // // JWT token
    // const token = generateJwtToken(user._id);

    // res.status(201).json({
    //   status: "success",
    //   token: token,
    // });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

// UPDATE PASSWORD OF LOGED IN USER

exports.updateMyPassword = async (req, res, next) => {
  try {
    console.log(req.user);

    // 1) Get user from DB
    const user = await User.findOne(req.user._id).select("+password");
    // 2) Check if posted current password is correct
    const isPasswordCorrect = await user.comparePassword(
      req.body.currentPassword,
      user.password,
    );
    if (!isPasswordCorrect) {
      return next(new AppError("The current password did not match!", 401));
    }
    // 3) Set new password
    user.password = req.body.password;
    user.passwordConfirmation = req.body.passwordConfirmation;
    await user.save();
    // 4) Log in user and send JWT token
    // Create and send JWT token
    createSendToken(user, 201, res);
    // const token = generateJwtToken(user._id);
    // res.status(201).json({
    //   status: "success",
    //   user: token,
    // });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/jwtToken.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, plan } = req.body;

  const role = "user";
  const user = await User.create({
    name,
    email,
    password,
    plan,
    role,
  });

  sendToken(user, 201, res);
});

// Login user
const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  //   const token = user.getJWTToken();

  //   res.status(200).json({
  //     success: true,
  //     // user,
  //     token,
  //   });
  sendToken(user, 200, res);
});

// Logout user
const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged Out",
    });
  console.log("logout");
});

const forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //   Get resetPasswordToken
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is as follows:\n\n ${resetPasswordUrl} \n\nIf you have not requested this email, then please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
    cookies: req.cookies.token,
  });
});

const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

const editUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  Object.keys(req.body).forEach((key) => {
    user[key] = req.body[key];
  });
  await user.save();
  res.status(200).json({
    success: true,
    message: "User updated successfully",
  });
});

const selfEditUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  Object.keys(req.body).forEach((key) => {
    // if (key === "password") {
    //   return;
    // }
    user[key] = req.body[key];
  });
  await user.save();
  res.status(200).json({
    success: true,
    message: "User updated successfully",
  });
});

const changeUserRole = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.role = req.body.role;
  await user.save();
  res.status(200).json({
    success: true,
    message: "User role updated successfully",
  });
});

// forgot password
const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get resetPasswordToken
  const resetToken = user.getPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is as follows:\n\n ${resetPasswordUrl} \n\nIf you have not requested this email, then please ignore it.`;

  try {
    console.log(resetToken);
    console.log(message);

    // await sendEmail({
    //   email: user.email,
    //   subject: `Ecommerce Password Recovery`,
    //   message,
    // });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);

  // res.status(200).json({
  //   success: true,
  //   message: "Password updated successfully",
  //   user,
  // });
});

const editImg = catchAsyncErrors(async (req, res, next) => {
  const url = req.body.profileImage;
  // console.log(url);

  let add = await User.findByIdAndUpdate(req.user.id, {
    img: {
      url: url,
    },
  });

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    add,
  });
});
export {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserDetails,
  deleteUser,
  editUser,
  selfEditUser,
  changeUserRole,
  forgotPassword,
  resetPassword,
  editImg,
};

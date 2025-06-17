import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import config from "../config/config.js";

const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  try {
    const decodedData = jwt.verify(token, config.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
  } catch (error) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }
});

// const isAdmin = (req, res, next) => {
//   if (
//     req.user &&
//     (req.user.role === "admin" || req.user.role === "superadmin")
//   ) {
//     next();
//   } else {
//     return next(
//       new ErrorHandler(
//         "Only admins and superadmin can access this resource",
//         403
//       )
//     );
//   }
// };

// const isSuperAdmin = (req, res, next) => {
//   if (req.user && req.user.role === "superadmin") {
//     next();
//   } else {
//     return next(
//       new ErrorHandler("Only superadmin can access this resource", 403)
//     );
//   }
// };

// make like pass in argument which roles you want to allow
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};

const isAdmin = authorizeRoles("admin", "superadmin");
const isSuperAdmin = authorizeRoles("superadmin");
export { isAuthenticatedUser, isAdmin, isSuperAdmin, authorizeRoles };

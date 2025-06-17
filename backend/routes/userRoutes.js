import express from "express";

import {
  loginUser,
  logoutUser,
  registerUser,
  getAllUsers,
  getUserDetails,
  editUser,
  deleteUser,
  selfEditUser,
  editImg,
  changeUserRole,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

import {
  //   isAdmin,
  isAuthenticatedUser,
  isSuperAdmin,
} from "../middleware/auth.js";
// import upload from "../config/multerConfig.js";

const router = express.Router();

// auth routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

// password routes
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/users").get(isAuthenticatedUser, isSuperAdmin, getAllUsers);

router.route("/user").get(isAuthenticatedUser, getUserDetails);
-router
  .route("/superadmin/user/:id")
  .put(isAuthenticatedUser, isSuperAdmin, editUser)
  .delete(isAuthenticatedUser, isSuperAdmin, deleteUser);

router.route("/user/:id/img").put(isAuthenticatedUser, editImg);

router.route("/user/:id").put(isAuthenticatedUser, getUserDetails);

router
  .route("/user/:id/role")
  .put(isAuthenticatedUser, isSuperAdmin, changeUserRole);

export default router;

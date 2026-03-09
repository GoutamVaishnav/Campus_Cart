import express from "express";

import {
  signup,
  login,
  verifyOTP,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  verifyResetOtp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/verify-otp", verifyOTP);

router.post("/refresh-token", refreshToken);

router.post("/logout", logout);

// forgot password flow
router.post("/forgot-password", forgotPassword);

router.post("/verify-reset-otp", verifyResetOtp);

router.post("/reset-password", resetPassword);

export default router;

import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { v4 as uuidv4 } from "uuid";

import generateOTP from "../utils/otpGenerator.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenGenerator.js";
import { sendOTPEmail } from "../utils/sendEmail.js";
import { log } from "console";

/////signup controller with otp generation and expiry time
// export const signup = async (req, res) => {
//   try {
//     const { name, email, phone, password, college } = req.body;

//     // ---------------- VALIDATIONS ----------------

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }

//     const phoneRegex = /^[0-9]{10}$/;
//     if (!phoneRegex.test(phone)) {
//       return res.status(400).json({
//         message: "Phone number must be exactly 10 digits",
//       });
//     }

//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;

//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         message:
//           "Password must include uppercase, lowercase, number and special character",
//       });
//     }

//     // ---------------- CHECK USER ----------------

//     const existingUser = await User.findOne({
//       $or: [{ email }, { phone }],
//     });

//     if (existingUser) {
//       if (existingUser.email === email) {
//         return res.status(400).json({ message: "Email already registered" });
//       }

//       if (existingUser.phone === phone) {
//         return res.status(400).json({
//           message: "Phone number already registered",
//         });
//       }
//     }

//     // ---------------- HASH PASSWORD ----------------

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // // generate otp
//     // const otp = generateOTP();

//     // ---------------- CREATE USER ----------------

//     const user = await User.create({
//       id: uuidv4(),
//       name,
//       email,
//       phone,
//       college,
//       password_hash: hashedPassword,
//     //   otp,
//     //   otp_expiry: Date.now() + 10 * 60 * 1000,
//       is_verified: false,
//     });

//     // ---------------- SEND OTP EMAIL ----------------

//     // await sendOTPEmail(email, otp);

//     res.status(201).json({
//       message: "User registered successfully. Please Login ...",
//       user
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Signup failed",
//       error: error.message,
//     });
//   }
// };
export const signup = async (req, res) => {
  try {
    console.log("signup hit");

    const { name, email, phone, password, college } = req.body;

    // ---------------- VALIDATIONS ----------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: "Phone number must be exactly 10 digits",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must include uppercase, lowercase, number and special character",
      });
    }

    // ---------------- CHECK USER ----------------
    console.log("signup hit");
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already registered",
      });
    }

    // ---------------- HASH PASSWORD ----------------

    const hashedPassword = await bcrypt.hash(password, 10);

    // ---------------- GENERATE OTP ----------------

    const otp = generateOTP();

    // ---------------- CREATE USER ----------------

    const user = await User.create({
      id: uuidv4(),
      name,
      email,
      phone,
      college,
      password_hash: hashedPassword,
      otp,
      otp_expiry: Date.now() + 10 * 60 * 1000,
      verified: false,
    });

    // ---------------- SEND OTP ----------------

    await sendOTPEmail(email, otp);

    res.status(201).json({
      message: "Signup successful. Please verify OTP",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
};
/////veryfy otp controller during signup to set verified to true and clear otp and expiry time

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found", data: false });

  if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP", data: false });

  if (user.otp_expiry < Date.now())
    return res.status(400).json({ message: "OTP expired", data: false });

  user.verified = true;

  user.otp = null;
  user.otp_expiry = null;

  await user.save();

  res.json({
    message: "Email verified successfully . Please Login ...",
    data: true,
  });
};

////login controller with access and refresh token generation
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) return res.status(401).json({ message: "Invalid password" });

  if(!user.verified) return res.status(403).json({ message: "Email not verified" });

  const accessToken = generateAccessToken(user.id);

  const refreshToken = generateRefreshToken(user.id);

  user.refresh_token = refreshToken;

  await user.save();

  res.json({
    message: "Login successful",
    accessToken,
    refreshToken,
    user,
  });
};

/// forgot password controller to generate reset token and expiry time
// export const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) return res.status(404).json({ message: "User not found" });

//   const resetToken = crypto.randomBytes(32).toString("hex");

//   user.reset_token = resetToken;

//   user.reset_token_expiry = Date.now() + 10 * 60 * 1000;

//   await user.save();

//   res.json({
//     message: "Reset token generated",
//     resetToken,
//   });
// };
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // generate otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otp_expiry = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    // send otp email
    await sendOTPEmail(email, otp);

    res.json({
      message: "OTP sent to registered email",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

/////verify reset otp
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: false,
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        data: false,
      });
    }

    if (user.otp_expiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
        data: false,
      });
    }
    // redirect to reset password page on frontend with email as query param
    user.otp = null;
    user.otp_expiry = null;
    res.json({
      message: "OTP verified successfully redirect to reset password page",
      email: user.email,
      data: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "OTP verification failed",
      error: error.message,
    });
  }
};

///reset password controller to reset password using reset token
// export const resetPassword = async (req, res) => {
//   const { token, newPassword } = req.body;

//   const user = await User.findOne({
//     reset_token: token,
//     reset_token_expiry: { $gt: Date.now() },
//   });

//   if (!user) return res.status(400).json({ message: "Invalid token" });

//   const hashed = await bcrypt.hash(newPassword, 10);

//   user.password_hash = hashed;

//   user.reset_token = null;

//   await user.save();

//   res.json({
//     message: "Password reset successful",
//   });
// };
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        data: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: false,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password_hash = hashedPassword;

    // clear otp
    user.otp = null;
    user.otp_expiry = null;

    await user.save();

    res.json({
      message: "Password reset successful. Please Login ... . redirect to login page",
        data: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Password reset failed",
      error: error.message,
    });
  }
};

////////refresh token controller
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  const user = await User.findOne({ refresh_token: refreshToken });

  if (!user) return res.status(403).json({ message: "Invalid refresh token" });

  const accessToken = generateAccessToken(user.id);

  res.json({
    accessToken,
  });
};

// logout controller to invalidate refresh token
export const logout = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findOne({ id: userId });

  if (!user) return res.status(404).json({ message: "User not found" });

  user.refresh_token = null;

  await user.save();

  res.json({
    message: "Logged out successfully",
  });
};

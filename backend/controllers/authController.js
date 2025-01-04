const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const mailService = require("../services/mailService");

const client = new OAuth2Client(process.env.GG_CLIENT_ID);
// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register User
const registerUser = async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  try {
    const userExisted = await User.findOne({ email });
    if (userExisted)
      return res
        .status(400)
        .json({ status: false, msg: "User Already Existed" });

    const newUser = new User({ fullName, email, phone, password });
    await newUser.save();
    res.json({ status: true, msg: "User Registered Successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: false, msg: "Internal server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ status: false, msg: "Invalid Email or Password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res
        .status(400)
        .json({ status: false, msg: "Invalid Email or Password" });

    // Return token
    const accessToken = jwt.sign(
      { userId: user._id, role: user?.role },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      success: true,
      msg: "Log in successfully",
      accessToken,
      role: user.role,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: false, msg: "Internal server error" });
  }
};

const loginWithGoogle = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GG_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    let user = await User.findOne({ email, googleId: sub });

    if (!user) {
      user = await User.create({
        email,
        fullName: name,
        password: Math.random().toString(36).slice(-8),
        phone: "",
        avatar: "",
        googleId: sub,
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(200).json({
      success: true,
      msg: "Login successfully",
      accessToken,
      role: user.role,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

// Forgot Password: Send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        msg: "User with this email does not exist",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to database
    await OTP.create({
      email,
      otp: await bcrypt.hash(otp, 10),
    });

    // Send OTP email
    await mailService.sendOTPEmail(email, otp, user.fullName);

    res.json({
      status: true,
      msg: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, msg: "Internal server error" });
  }
};

// Init Reset Flow
const initResetFlow = async (req, res) => {
  try {
    const { email } = req.body;

    // Set cookies for reset flow
    res.cookie("reset-flow-token", crypto.randomUUID(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 60 * 1000, // 30 minutes
      sameSite: "lax",
    });

    res.cookie("reset-email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 60 * 1000,
      sameSite: "lax",
    });

    res.json({ status: true, msg: "Reset flow initialized" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, msg: "Internal server error" });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the most recent OTP for this email
    const otpDoc = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!otpDoc) {
      return res.status(400).json({
        status: false,
        msg: "OTP expired or invalid",
      });
    }

    // Verify OTP
    const isValid = await bcrypt.compare(otp, otpDoc.otp);
    if (!isValid) {
      return res.status(400).json({
        status: false,
        msg: "Invalid OTP",
      });
    }

    // Generate reset token
    const resetToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    // Set otp-verified cookie
    res.cookie("otp-verified", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 minutes
      sameSite: "lax",
    });

    // Update or set reset-flow-token if not exists
    res.cookie("reset-flow-token", crypto.randomUUID(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
      sameSite: "lax",
    });

    res.json({
      status: true,
      msg: "OTP verified successfully",
      resetToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, msg: "Internal server error" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    // Verify reset token
    const decoded = jwt.verify(resetToken, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    // Clear all OTPs for this email
    await OTP.deleteMany({ email });

    res.json({
      status: true,
      msg: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, msg: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  initResetFlow,
  verifyOTP,
  resetPassword,
  loginWithGoogle,
};

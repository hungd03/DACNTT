const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  initResetFlow,
  verifyOTP,
  resetPassword,
  loginWithGoogle,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-auth", loginWithGoogle);
router.post("/forgot-password", forgotPassword);
router.post("/init-reset-flow", initResetFlow);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

module.exports = router;

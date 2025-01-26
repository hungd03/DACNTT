const express = require("express");
const router = express.Router();
const {
  getVnpayResult,
  getMomoResult,
} = require("../controllers/paymentController");

router.get("/vnpay-return", getVnpayResult);
router.get("/momo-return", getMomoResult);

module.exports = router;

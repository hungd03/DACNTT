const express = require("express");
const router = express.Router();
const CouponController = require("../controllers/couponController");
const verifyToken = require("../middlewares/Auth");

router.get("/", verifyToken, CouponController.getAllCoupons);
router.get("/:id", verifyToken, CouponController.getCoupon);
router.post("/discount", verifyToken, CouponController.calculateDiscountAmount);
router.post("/", verifyToken, CouponController.createCoupon);
router.patch("/:id", verifyToken, CouponController.updateCoupon);
router.delete("/:id", verifyToken, CouponController.deleteCoupon);
router.patch("/:id/hide", verifyToken, CouponController.hiddenCoupon);

module.exports = router;

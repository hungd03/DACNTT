const CouponService = require("../services/couponService");

class CouponController {
  async getAllCoupons(req, res) {
    try {
      const fields = req.query.fields || "";
      const userId = req.user.userId;
      const coupons = await CouponService.getAllCoupons({
        fields,
        sortBy: req.query.sortBy || "createdAt",
        sortType: (req.query.sort || "desc") === "asc" ? 1 : -1,
        isShowHidden: true,
        userId,
      });
      res.json({ success: true, data: coupons });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getCoupon(req, res) {
    try {
      const coupon = await CouponService.getCoupon(req.params.id);
      res.json({ success: true, data: coupon });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async calculateDiscountAmount(req, res) {
    try {
      const code = (req.body?.code ?? "").trim();
      const subtotal = Number.parseInt(req.body?.subtotal ?? "0", 10);
      if (!code || !subtotal) {
        return res.status(400).json({
          success: false,
          message: "Coupon code and subtotal are required",
        });
      }

      if (isNaN(subtotal) || subtotal <= 0) {
        return res.status(400).json({
          success: false,
          message: "Subtotal must be a positive number",
        });
      }

      const result = await CouponService.calculateDiscountAmount(
        code,
        subtotal
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async hiddenCoupon(req, res) {
    try {
      const coupon = await CouponService.hiddenCoupon(req.params.id);
      res.json({ success: true, data: coupon });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async createCoupon(req, res) {
    try {
      const coupon = await CouponService.createCoupon(req.body);
      res.status(201).json({ success: true, data: coupon });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateCoupon(req, res) {
    try {
      const coupon = await CouponService.updateCoupon(req.params.id, req.body);
      res.json({ success: true, data: coupon });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteCoupon(req, res) {
    try {
      await CouponService.deleteCoupon(req.params.id);
      res.json({ success: true, message: "Coupon deleted successfully" });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CouponController();

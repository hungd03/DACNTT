const Coupon = require("../models/Coupon");
const User = require("../models/User");
const constants = require("../constants");
const { isEmpty, isBlank } = require("../utils/StringUitls");
const ApiErrorUtils = require("../utils/ApiErrorUtils");

const SELECTED_FIELDS =
  "_id code codeType quantity usedCount startDate endDate discount discountType minimumOrder maximumDiscount image isHide createdAt updatedAt";

class CouponService {
  async getAllCoupons(options = {}) {
    let {
      fields,
      filters = {},
      sortBy = "createdAt",
      sortType = -1,
      isShowHidden = true,
      userId,
    } = options;

    if (isEmpty(fields) || isBlank(fields)) {
      fields = SELECTED_FIELDS;
    }

    if (fields.indexOf(",") > -1) {
      fields = fields.split(",").join(" ");
    }

    if (!isShowHidden) {
      filters.isHide = false;
    }

    const sortOtp = {};
    sortOtp[sortBy] = sortType;

    // 1. Lấy danh sách coupon đã sử dụng của user
    const user = await User.findById(userId)
      .select("orderHistory")
      .lean()
      .exec();

    const usedCouponIds = new Set();
    if (user?.orderHistory) {
      user.orderHistory.forEach((order) => {
        if (order.couponUsage) {
          order.couponUsage.forEach((couponId) => {
            usedCouponIds.add(couponId.toString());
          });
        }
      });
    }

    // 2. Lấy tất cả coupon hợp lệ và filter luôn
    const coupons = await Coupon.find(filters)
      .select(fields)
      .sort(sortOtp)
      .lean()
      .exec();

    // 3. Lọc bỏ những coupon đã sử dụng
    return coupons.filter(
      (coupon) => !usedCouponIds.has(coupon._id.toString())
    );
  }

  async getCoupon(id) {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      throw ApiErrorUtils.simple("Voucher not found", 404);
    }

    return coupon;
  }

  async calculateDiscountAmount(code, subtotal) {
    const filters = {
      code,
      isHide: false,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    };

    // Find valid coupon
    const coupon = await Coupon.findOne(filters)
      .select(
        "code codeType discount discountType minimumOrder maximumDiscount"
      )
      .lean()
      .exec();

    if (!coupon) {
      throw ApiErrorUtils.simple("Invalid or expired voucher code", 404);
    }

    // Check minimum order amount
    if (subtotal < coupon.minimumOrder) {
      throw ApiErrorUtils.simple(
        `Order must be at least ${coupon.minimumOrder}đ to use this voucher`,
        400
      );
    }

    // Check quantity
    if (coupon.quantity <= 0) {
      throw ApiErrorUtils.simple("This voucher has been fully used", 400);
    }

    let discountAmount = 0;

    // Calculate discount based on type
    if (coupon.discountType === constants.COUPON.DISCOUNT_TYPE.PERCENT) {
      discountAmount = (subtotal * coupon.discount) / 100;
      // Apply maximum discount if set
      if (coupon.maximumDiscount > 0) {
        discountAmount = Math.min(discountAmount, coupon.maximumDiscount);
      }
    } else {
      discountAmount = coupon.discount;
    }

    return {
      amount: discountAmount,
      couponData: coupon,
    };
  }

  async hiddenCoupon(id) {
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      throw ApiErrorUtils.simple("Voucher not found", 404);
    }

    coupon.isHide = !coupon.isHide;
    await coupon.save();

    return coupon;
  }

  async createCoupon(data) {
    // Validate dates
    if (new Date(data.beginDate) > new Date(data.endDate)) {
      throw ApiErrorUtils.simple("Begin date must be before end date", 400);
    }

    // Check if code already exists
    const existingCoupon = await Coupon.findOne({ code: data.code });
    if (existingCoupon) {
      throw ApiErrorUtils.simple("Voucuer code already exists", 400);
    }

    if (data.discountType === constants.COUPON.DISCOUNT_TYPE.FIXED) {
      data.maximumDiscount = data.discount;
    }
    const coupon = new Coupon(data);
    await coupon.save();

    return coupon;
  }

  async updateCoupon(id, updatedData) {
    // Validate dates if they are being updated
    if (updatedData.beginDate && updatedData.endDate) {
      if (new Date(updatedData.beginDate) > new Date(updatedData.endDate)) {
        throw ApiErrorUtils.simple("Begin date must be before end date", 400);
      }
    }

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true }
    );

    if (!coupon) {
      throw ApiErrorUtils.simple("Voucher not found", 404);
    }

    return coupon;
  }

  async deleteCoupon(id) {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      throw ApiErrorUtils.simple("Voucher not found", 404);
    }

    return coupon;
  }
}

module.exports = new CouponService();

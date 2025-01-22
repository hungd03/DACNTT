const mongoose = require("mongoose");
const constants = require("../constants");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, trim: true, required: true, unique: true },
    codeType: {
      type: String,
      trim: true,
      enum: Object.values(constants.COUPON.COUPON_TYPE),
      default: constants.COUPON.COUPON_TYPE.SHOPPING,
    },
    quantity: { type: Number, required: true, default: 0 },
    usedCount: { type: Number, default: 0 },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    minimumOrder: { type: Number, default: 0 }, // Đơn hàng tối thiểu ...đ
    maximumDiscount: { type: Number, default: 0 }, // Giảm tối đa ...đ

    discount: { type: Number, required: true, default: 0 },
    discountType: {
      type: String,
      trim: true,
      enum: Object.values(constants.COUPON.DISCOUNT_TYPE),
      default: constants.COUPON.DISCOUNT_TYPE.PERCENT,
    },

    isHide: { type: Boolean, required: true, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Coupon", couponSchema);

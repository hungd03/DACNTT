const mongoose = require("mongoose");
const constants = require("../constants");

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productImage: { type: String },
  color: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  sku: { type: String, required: true },
});

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  addressLine2: { type: String },
  ward: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderDate: { type: Date, default: Date.now },
    paymentMethod: {
      type: String,
      enum: Object.values(constants.ORDER.PAYMENT_METHOD),
      default: constants.ORDER.PAYMENT_METHOD.COD,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(constants.ORDER.PAYMENT_STATUS),
      default: constants.ORDER.PAYMENT_STATUS.UNPAID,
      required: true,
    },
    orderType: { type: String, default: "Delivery", required: true },
    orderStatus: {
      type: String,
      enum: Object.values(constants.ORDER.STATUS),
      default: constants.ORDER.STATUS.PENDING,
      required: true,
    },
    returnReason: { type: String },
    returnStatus: {
      type: String,
      enum: Object.values(constants.ORDER.RETURN_STATUS),
      default: constants.ORDER.RETURN_STATUS.PENDING,
    },
    cancelReason: { type: String },
    items: [orderItemSchema],
    shippingAddress: { type: addressSchema, required: true },
    subtotal: { type: Number, required: true },
    appliedCoupons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Coupon" }],
    shippingCharge: { type: Number, required: false },
    shippingDiscount: { type: Number, required: false },
    discount: { type: Number, required: false },
    total: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Orders", orderSchema);

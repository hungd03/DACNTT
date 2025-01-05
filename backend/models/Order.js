const mongoose = require("mongoose");

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
  address: { type: String },
  ward: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderDate: { type: Date, default: Date.now },
    paymentType: { type: String, required: true },
    paymentStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Paid" },
    orderType: { type: String, required: true },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "On the way",
        "Delivered",
        "Rejected",
        "Cancelled",
        "Returned",
        "Refunded",
      ],
      default: "Pending",
    },
    returnReason: { type: String },
    refundStatus: {
      type: String,
      enum: ["Pending", "Processed", "Rejected"],
      default: "Pending",
    },
    cancellationReason: { type: String },
    items: [orderItemSchema],
    shippingAddress: { type: addressSchema, required: true },
    billingAddress: { type: addressSchema, required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    discount: { type: Number, required: true },
    shippingCharge: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", orderSchema);

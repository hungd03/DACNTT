const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const slugGenerator = require("mongoose-slug-updater");

const addressSchema = new mongoose.Schema({
  fullName: { type: String, trim: true, required: true },
  email: { type: String, trim: true, required: true },
  phone: { type: String, trim: true, required: true },
  street: { type: String, trim: true, required: true },
  ward: { type: String, trim: true, required: true },
  district: { type: String, trim: true, required: true },
  city: { type: String, trim: true, required: true },
});

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, required: true },
    slug: { type: String, slug: "fullName", slugPaddingSize: 2, unique: true },
    email: { type: String, trim: true, required: true, unique: true },
    phone: { type: String, trim: true },
    avatar: {
      url: { type: String },
      publicId: { type: String },
    },
    googleId: { type: String },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    shippingAddress: [addressSchema],
    billingAddress: [addressSchema],
    orderHistory: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Orders" },
        date: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["pending", "shipped", "delivered", "cancelled"],
          default: "pending",
        },
        totalAmount: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

userSchema.plugin(slugGenerator);

// Middleware to hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Comparing password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          sku: { type: String, trim: true, required: true },
          quantity: { type: Number, required: true, min: 1 },
        },
      ],
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Cart", cartSchema);

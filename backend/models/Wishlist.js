const mongoose = require("mongoose");

const wishlistShcema = new mongoose.Schema({
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  countProduct: { type: Number, default: 0 },
});

module.exports = mongoose.model("Wishlist", wishlistShcema);

const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

exports.addProductToWishlist = async (req, res) => {
  try {
    const { product } = req.body;
    const user = req.user?.userId;

    const data = await Product.findById(product);
    if (!data) {
      return res.status(404).json({ status: false, msg: "Product Not Found!" });
    }

    let wishlist = await Wishlist.findOne({ user });
    if (!wishlist) {
      wishlist = new Wishlist({ user, products: [product], countProduct: 1 });
    } else {
      if (!wishlist.products.includes(product)) {
        wishlist.products.push(product);
        wishlist.countProduct = wishlist.products.length;
      }
    }
    await wishlist.save();
    res.status(200).json({ status: true, data: wishlist });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: false,
      msg: "Internal server error",
      error: err.message,
    });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = req.user?.userId;

    const wishlist = await Wishlist.findOne({ user }).populate("products");
    if (!wishlist) {
      return res.status(404).json({ status: false, msg: "Wishlist Not Found" });
    }

    res.status(200).json({ status: true, data: wishlist });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: false,
      msg: "Internal server error",
      error: err.message,
    });
  }
};

exports.removeProductFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = req.user?.userId;

    const wishlist = await Wishlist.findOne({ user });
    if (!wishlist) {
      return res.status(404).json({ status: false, msg: "Wishlist Not Found" });
    }

    wishlist.products = wishlist.products.filter(
      (item) => item.toString() !== productId.toString()
    );
    wishlist.countProduct = wishlist.products.length;
    await wishlist.save();
    res
      .status(200)
      .json({ status: true, msg: "Product Removed From Wishlist" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: false,
      msg: "Internal server error",
      error: err.message,
    });
  }
};

exports.removeAllProductFromWishlist = async (req, res) => {
  try {
    const user = req.user?.userId;

    const wishlist = await Wishlist.findOneAndUpdate(
      { user },
      { $set: { products: [] }, countProduct: 0 },
      { new: true }
    );

    if (!wishlist) {
      return res.status(404).json({ status: false, msg: "Wishlist Not Found" });
    }

    res.status(200).json({ status: true, msg: "Wishlist Cleared" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: false,
      msg: "Internal server error",
      error: err.message,
    });
  }
};

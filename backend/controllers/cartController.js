const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addOrUpdateCart = async (req, res) => {
  const { productId, variationId, quantity } = req.body;
  const userId = req.user?.userId;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ status: false, msg: "Product Not Found" });
    }

    const variation = product.variants.find(
      (v) => v._id.toString() === variationId
    );
    if (!variation) {
      return res
        .status(404)
        .json({ status: false, msg: "Variation Not Found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, variationId, quantity }],
        countProduct: 1,
      });
    } else {
      const existingItem = cart.items.find(
        (item) =>
          item.productId.toString() === productId &&
          item.variationId.toString() === variationId
      );
      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        cart.items.push({ productId, variationId, quantity });
      }
      cart.countProduct = cart.items.length;
    }

    await cart.save();
    res.status(201).json({ status: true, data: cart });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: false,
      msg: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.getAllItemsInCart = async (req, res) => {
  const userId = req.user?.userId;

  try {
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      populate: { path: "variants" },
    });

    if (!cart) {
      return res.status(404).send({ status: false, msg: "Cart Not Found" });
    }

    const items = cart.items.map((item) => {
      const product = item.productId;
      const matchingVariation = product.variants.find(
        (v) => v._id.toString() === item.variationId.toString()
      );
      return {
        ...item.toObject(),
        variation: matchingVariation.toObject(),
      };
    });

    res.status(200).json({ status: true, data: { ...cart.toObject(), items } });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: false,
      msg: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.updateQuantityOfItemInCart = async (req, res) => {
  const userId = req.user?.userId;
  const { productId, variationId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).send({ status: false, msg: "Cart Not Found" });
    }

    const item = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        item.variationId.toString() === variationId
    );
    if (!item) {
      return res
        .status(404)
        .json({ status: false, msg: "Product Variation Not Found In Cart" });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ status: true, msg: "Cart Updated", data: cart });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: false,
      msg: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.removeItemFromCart = async (req, res) => {
  const { productId, variationId } = req.params;
  const userId = req.user?.userId;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ status: false, msg: "Cart Not Found" });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.productId.toString() !== productId ||
        item.variationId.toString() !== variationId
    );
    cart.countProduct = cart.items.length;
    await cart.save();

    res.status(200).json({
      status: true,
      msg: "Product Variation Removed From Cart",
      data: cart,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: false,
      msg: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.clearCart = async (req, res) => {
  const userId = req.user?.userId;

  try {
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [], countProduct: 0 } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ status: false, msg: "Cart Not Found" });
    }

    res.status(200).json({ status: true, msg: "Cart Cleared", data: cart });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      status: false,
      msg: "Internal Server Error",
      error: err.message,
    });
  }
};

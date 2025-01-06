const Orders = require("../models/Orders");
const User = require("../models/User");
const Product = require("../models/Product");

const generateOrderId = async () => {
  const currentDate = new Date();

  const dateId =
    "#" + currentDate.toLocaleDateString("vi-VN").replace(/\//g, "");
  const timeId = currentDate
    .toLocaleTimeString("vi-VN", { hour12: false })
    .replace(/:/g, "");

  const orderId = `${dateId}${timeId}`;

  return orderId;
};

exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentType,
      orderType,
      subtotal,
      tax,
      discount,
      shippingCharge,
      total,
    } = req.body;

    const userId = req.user.userId;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: false, msg: "Order items are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, msg: "User not found" });
    }

    const orderId = await generateOrderId();
    const newOrder = new Orders({
      orderId,
      userId,
      items,
      shippingAddress,
      billingAddress,
      paymentType,
      orderType,
      subtotal,
      tax,
      discount,
      shippingCharge,
      total,
      orderStatus: "Pending",
    });

    for (const item of items) {
      const product = await Product.findOne({
        "variants.sku": item.sku,
      });

      if (!product) {
        return res.status(404).json({
          status: false,
          msg: `Product with SKU ${item.sku} not found`,
        });
      }

      const variant = product.variants.find((v) => v.sku === item.sku);

      if (!variant) {
        return res.status(404).json({
          status: false,
          msg: `Variant with SKU ${item.sku} not found`,
        });
      }

      // Update variant stock and soldCount
      variant.stock -= item.quantity;
      variant.soldCount += item.quantity;
    }
    await newOrder.save();

    user.orderHistory.push({
      orderId: newOrder._id,
      date: new Date(),
      status: "pending",
      totalAmount: total,
    });
    await user.save();

    res.status(201).json({
      status: true,
      msg: "Order created successfully",
      data: newOrder,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: false, msg: err.message });
  }
};

exports.getAllOrder = async (req, res) => {
  try {
    const orders = await Orders.find().populate("userId");
    res.status(200).json({
      status: true,
      msg: "Orders Fetched Successfully!",
      data: orders,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: false, msg: err.message });
  }
};

exports.getOrdersOfUserByUserId = async (req, res) => {
  const userId = req.user?.userId;
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Build query object
    const query = { userId: userId };

    // Get total count for pagination
    const total = await Orders.countDocuments(query);

    // Get orders with pagination and sorting
    const orders = await Orders.find(query)
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .select("-__v");

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    res.status(200).json({
      status: true,
      data: {
        orders,
        pagination: {
          total,
          page,
          totalPages,
          hasNext,
          hasPrev,
        },
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: false, msg: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Orders.findById(id);
    if (!order) {
      return res.status(404).json({ staus: false, msg: "Order Not Found" });
    }
    res.status(200).json({ status: true, msg: "Order Found", data: order });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: false, msg: err.message });
  }
};

exports.updateOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Orders.findByIdAndUpdate(
      id,
      { orderStatus: req.body.orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ status: false, msg: "Order Not Found" });
    }
    res.status(200).json({ status: true, msg: "Order Updated Succesfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: false, msg: err.message });
  }
};

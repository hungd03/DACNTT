const mongoose = require("mongoose");
const constants = require("../constants");
const Orders = require("../models/Orders");
const User = require("../models/User");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const CouponService = require("../services/couponService");
const CartService = require("../services/cartService");
const VnpayService = require("../services/vnpayService");
const MomoService = require("../services/momoService");
const mailService = require("../services/mailService");
const { formatOrderDataForEmail } = require("../utils/orderFormatter");

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

const createTransaction = async (orderData, userId) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    const orderToSave = new Orders({
      ...orderData,
      items: [],
      userId,
    });

    for (let i = 0; i < orderData.items.length; i++) {
      const cartItem = orderData.items[i];

      const product = await Product.findOne({
        _id: cartItem.productId,
        "variants.sku": cartItem.sku,
      })
        .lean()
        .exec();

      if (!product || product?.variants?.length === 0) {
        throw new Error(
          JSON.stringify({
            statusCode: 404,
            message: "Product not found",
            errors: {
              productId: cartItem.productId,
              sku: cartItem.sku,
            },
          })
        );
      }

      const selectedVariant = product.variants.find(
        (variant) => variant.sku === cartItem.sku
      );
      if (!selectedVariant) {
        throw new Error(
          JSON.stringify({
            statusCode: 404,
            message: `Product with SKU ${cartItem.sku} not found`,
            errors: {
              productId: cartItem.productId,
              sku: cartItem.sku,
            },
          })
        );
      }

      if (
        selectedVariant.soldCount + cartItem.quantity >
        selectedVariant.stock
      ) {
        throw new Error(
          JSON.stringify({
            statusCode: 404,
            message: "Product out of stock",
            errors: {
              productId: product._id,
              sku: product.variants[0].sku,
            },
          })
        );
      }

      await Product.findOneAndUpdate(
        {
          _id: cartItem.productId,
          "variants.sku": cartItem.sku,
        },
        {
          $inc: {
            "variants.$.soldCount": cartItem.quantity,
          },
        },
        { session }
      );

      orderToSave.items.push({
        productId: product._id.toString(),
        sku: product.variants[0].sku,
        productName: product.name,
        productImage: selectedVariant.variantImage.url,
        color: selectedVariant.color,
        price: selectedVariant.price,
        quantity: cartItem.quantity,
      });
    }

    const subTotal = orderToSave.items.reduce((acc, cur) => {
      return acc + cur.quantity * cur.price;
    }, 0);

    let shippingDiscount = 0;
    let productDiscount = 0;
    const usedCoupons = [];

    if (orderData.appliedCoupons && Array.isArray(orderData.appliedCoupons)) {
      for (const couponCode of orderData.appliedCoupons) {
        try {
          const { amount, couponData: coupon } =
            await CouponService.calculateDiscountAmount(couponCode, subTotal);

          usedCoupons.push(coupon._id);

          if (coupon.codeType === "shipping") {
            shippingDiscount = amount;
          } else {
            productDiscount = amount;
          }

          await Coupon.findByIdAndUpdate(
            coupon._id,
            { $inc: { usedCount: 1 } },
            { session }
          );
        } catch (error) {
          console.warn(`Coupon processing error: ${error.message}`);
        }
      }
    }

    shippingDiscount = Number(shippingDiscount) || 0;
    productDiscount = Number(productDiscount) || 0;

    let shippingCharge = 25000;

    orderToSave.orderId = generateOrderId();
    orderToSave.subtotal = subTotal;
    orderToSave.shippingCharge = shippingCharge;
    orderToSave.shippingDiscount = shippingDiscount;
    orderToSave.discount = productDiscount;
    orderToSave.total =
      subTotal + shippingCharge - shippingDiscount - productDiscount;
    orderToSave.appliedCoupons = usedCoupons;

    const order = await orderToSave.save({ session });

    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          orderHistory: {
            orderId: order._id,
            date: new Date(),
            totalAmount: order.total,
            couponUsage: usedCoupons,
          },
        },
      },
      { session }
    );

    await CartService.clearCart(userId);

    await session.commitTransaction();
    await session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderData = req.body;

    if (!orderData.items || orderData.items.length === 0) {
      return res
        .status(400)
        .json({ status: false, msg: "Order items are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ status: false, msg: "User not found" });
    }

    const order = await createTransaction(orderData, userId);

    const formattedOrderData = formatOrderDataForEmail(order);
    await mailService.sendEmailCreateOrder(formattedOrderData);

    res.status(201).json({
      status: true,
      msg: "Order created successfully",
      data: order,
    });
  } catch (err) {
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

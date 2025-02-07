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
const generateOrderId = require("../utils/generateOrderId");

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

    if (order) {
      let paymentUrl = "";
      if (req.body.paymentMethod === constants.ORDER.PAYMENT_METHOD.VNPAY) {
        paymentUrl = await VnpayService.createPaymentUrl(
          req.ipv4,
          order._id.toString(),
          order.total
        );
      }

      if (req.body.paymentMethod === constants.ORDER.PAYMENT_METHOD.MOMO) {
        // Momo Payment Test giới hạn total <= 50.000.000đ

        // if (order.total > 50000000) {
        //   return res.status(400).json({
        //     status: false,
        //     msg: "Order amount exceeds MOMO payment limit (50,000,000 VND). Please choose another payment method or split your order.",
        //   });
        // }
        paymentUrl = await MomoService.createPaymentUrl(
          order._id.toString(),
          order.total
        );
      }

      const formattedOrderData = formatOrderDataForEmail(order);
      await mailService.sendEmailCreateOrder(formattedOrderData);

      res.status(201).json({
        status: true,
        msg: "Order created successfully",
        data: order,
        url: paymentUrl,
      });
    }
  } catch (err) {
    console.error(err.message);
    try {
      const errorData = JSON.parse(err.message);
      return res.status(errorData.statusCode).json({
        status: false,
        msg: errorData.message,
        errors: errorData.errors,
      });
    } catch (parseError) {
      return res.status(500).json({
        status: false,
        msg: err.message || "Internal server error",
      });
    }
  }
};

exports.getAllOrder = async (req, res) => {
  const {
    orderId,
    customer,
    product,
    paymentMethod,
    orderStatus,
    page = 1,
    limit = 10,
  } = req.query;

  try {
    const skip = (page - 1) * limit;
    const query = {};

    if (orderId) query.orderId = { $regex: orderId, $options: "i" };
    if (paymentMethod && paymentMethod !== "all")
      query.paymentMethod = paymentMethod;
    if (orderStatus && orderStatus !== "all") query.orderStatus = orderStatus;

    if (customer) {
      query["shippingAddress.fullName"] = { $regex: customer, $options: "i" };
    }

    if (product) {
      query["items"] = {
        $elemMatch: {
          productName: { $regex: product, $options: "i" },
        },
      };
    }

    const [orders, total] = await Promise.all([
      Orders.find(query)
        .sort({ createdAt: -1 })
        .populate("userId", "-_id avatar")
        .skip(skip)
        .limit(parseInt(limit)),
      Orders.countDocuments(query),
    ]);

    res.status(200).json({
      status: true,
      msg: "Orders Fetched Successfully!",
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      msg: "Error fetching orders",
      error: err.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Orders.findById(id).populate({
      path: "userId",
      select: "avatar -_id",
    });
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
  const { orderStatus, reason, description } = req.body;

  try {
    const order = await Orders.findById(id);
    if (!order) {
      return res.status(404).json({
        status: false,
        msg: "Order Not Found",
      });
    }

    // Update order
    let updateData = {
      orderStatus,
    };

    if (reason || description) {
      updateData.cancelOrder = {
        reason,
        description,
      };
    }

    if ([constants.ORDER.STATUS.CANCELLED].includes(orderStatus)) {
      updateData.paymentStatus = constants.ORDER.PAYMENT_STATUS.CANCELLED;
    }
    if (
      [constants.ORDER.STATUS.CANCELLED].includes(orderStatus) &&
      [constants.ORDER.CANCEL_ORDER.UNCONFIRMED].includes(reason)
    ) {
      updateData.paymentStatus = constants.ORDER.PAYMENT_STATUS.CANCELLED;
      updateData.cancelOrder.reason = constants.ORDER.CANCEL_ORDER.UNCONFIRMED;
    }
    if (
      [constants.ORDER.STATUS.CANCELLED].includes(orderStatus) &&
      [constants.ORDER.CANCEL_ORDER.BUYER_DECLIEND].includes(reason)
    ) {
      updateData.paymentStatus = constants.ORDER.PAYMENT_STATUS.CANCELLED;
      updateData.cancelOrder.reason =
        constants.ORDER.CANCEL_ORDER.BUYER_DECLIEND;
    }

    const updatedOrder = await Orders.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      status: true,
      msg: "Order Updated Successfully",
      data: updatedOrder,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: false, msg: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  const { id } = req.params;
  const { reason, description } = req.body;

  try {
    const order = await Orders.findById(id);

    if (!order) {
      return res.status(404).json({
        status: false,
        msg: "Order Not Found",
      });
    }

    let updateData = {
      cancelOrder: {
        reason,
        description,
      },
    };

    // Nếu order đang ở trạng thái PENDING -> update status ngay
    if (order.orderStatus === constants.ORDER.STATUS.PENDING) {
      updateData.orderStatus = constants.ORDER.STATUS.CANCELLED;
      updateData.paymentStatus = constants.ORDER.PAYMENT_STATUS.CANCELLED;
      updateData.cancelOrder.reason = reason;
    }

    // Nếu order đang PREPARING -> chỉ lưu thông tin cancel request
    // Admin sẽ xem xét và quyết định có cancel hay không sau
    const updatedOrder = await Orders.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (updatedOrder.orderStatus === "preparing" && updatedOrder.cancelOrder) {
      updatedOrder.orderStatus = constants.ORDER.STATUS.CANCELLATION_PENDING;
      updatedOrder.save();
    }

    const message =
      order.orderStatus === constants.ORDER.STATUS.PENDING
        ? "Order Cancelled Successfully"
        : "Cancellation request submitted successfully. Waiting for admin approval";

    res.status(200).json({
      status: true,
      msg: message,
      data: updatedOrder,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: false, msg: err.message });
  }
};

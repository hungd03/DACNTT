const VnpayService = require("../services/vnpayService");
const MomoService = require("../services/momoService");
const Orders = require("../models/Orders");
const constants = require("../constants");

exports.getVnpayResult = async (req, res, next) => {
  try {
    const result = await VnpayService.checkPaymentStatus(req.query);
    let message = "";
    if (result.isSuccess) {
      const order = await Orders.findById(result.data.orderId);
      if (order.total === result.data.amount / 100) {
        order.paymentStatus = constants.ORDER.PAYMENT_STATUS.PAID;
        await Orders.updateOne({ _id: order._id }, order);
      }
      message = "Payment sucessfully";
      res.send(`
        <script>
        window.open('http://localhost:3000/success?orderId=${order.orderId}&total=${order.total}', '_self', '');
        </script>
    `);
    } else {
      message = "Payment failed";
    }
  } catch (error) {
    next(error);
  }
};

exports.getMomoResult = async (req, res, next) => {
  try {
    const result = await MomoService.getPaymentStatus(req.query);
    let message = "";

    if (result.isSuccess) {
      const order = await Orders.findById(result.orderId);
      order.paymentStatus = constants.ORDER.PAYMENT_STATUS.PAID;
      await Orders.updateOne({ _id: order._id }, order);
      message = "Payment Successfully";

      res.send(`
        <script>
        window.open('http://localhost:3000/success?orderId=${order.orderId}&total=${order.total}', '_self', '');
        </script>
    `);
    } else {
      message = "Payment failed";
    }
  } catch (error) {
    next(error);
  }
};

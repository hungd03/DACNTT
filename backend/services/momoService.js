require("dotenv").config();
const crypto = require("crypto");
const axios = require("axios");

class MomoService {
  async createPaymentUrl(orderID, orderAmount) {
    var partnerCode = "MOMO";
    var accessKey = "F8BBA842ECF85";
    var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    var requestId = partnerCode + new Date().getTime();
    var orderId = requestId;
    var orderInfo = `Thanh toan don hang ${orderID}`;
    var redirectUrl = process.env.MOMO_RETURN_URL;
    var ipnUrl = process.env.MOMO_RETURN_URL;
    // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    // var amount = orderAmount;
    var amount = 2000000;
    var requestType = "captureWallet";
    var extraData = ""; //pass empty value if your merchant does not have stores

    var rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      redirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      requestType;

    var signature = crypto
      .createHmac("sha256", secretkey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: "en",
    });

    const response = await axios.post(process.env.MOMO_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.payUrl;
  }

  async getPaymentStatus(momoResponse) {
    let momo_Params = momoResponse;

    const orderId = momo_Params["orderInfo"].split(" ").pop();

    let isSuccess = false,
      message = "Payment failed";

    if (momo_Params["resultCode"] === "0") {
      isSuccess = true;
      message = "Payment success";
      return { isSuccess, orderId, message };
    } else {
      return { isSuccess: false, message };
    }
  }
}

module.exports = new MomoService();

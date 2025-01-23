require("dotenv").config();
const { format } = require("date-fns");
const crypto = require("crypto");
const queryString = require("qs");

const tmnCode = process.env.VNPAY_TMN_CODE;
const secretKey = process.env.VNPAY_SECURE_SECRET;
const vnpayUrl = process.env.VNPAY_URL;

class VnpayService {
  async createPaymentUrl(
    ipAddress,
    orderId,
    orderAmount,
    language = "vn",
    bankCode = ""
  ) {
    const returnUrl = process.env.VNPAY_RETURN_URL;
    const createDate = format(new Date(), "yyyyMMddHHmmss");
    const txnRef = format(new Date(), "HHmmss");

    let locale = "vn";
    if (language && ["vn", "en"].indexOf(language) >= 0) {
      locale = language;
    }
    const currCode = "VND";

    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = txnRef;
    vnp_Params["vnp_OrderInfo"] = JSON.stringify(orderId);
    vnp_Params["vnp_OrderType"] = "topup";
    vnp_Params["vnp_Amount"] = orderAmount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddress;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    const signData = queryString.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    const paymentUrl =
      vnpayUrl + "?" + queryString.stringify(vnp_Params, { encode: false });
    return paymentUrl;
  }

  async checkPaymentStatus(vnpayResponse) {
    let vnp_Params = vnpayResponse;
    const secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    const signData = queryString.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      const amount = vnp_Params["vnp_Amount"];
      const txnRef = vnp_Params["vnp_TxnRef"];
      const orderId = decodeURIComponent(vnp_Params["vnp_OrderInfo"]).replace(
        /"/g,
        ""
      );
      const payDate = vnp_Params["vnp_PayDate"]; // yyyyMMddHHmmss
      const bankCode = vnp_Params["vnp_BankCode"];
      const bankTranNo = vnp_Params["vnp_BankTranNo"];
      const cartType = vnp_Params["vnp_CardType"];
      const transactionNo = vnp_Params["vnp_TransactionNo"];

      let isSuccess = false,
        message = "Payment failed";

      if (vnp_Params["vnp_TransactionStatus"] === "00") {
        isSuccess = true;
        message = "Payment success";
      }

      return {
        isSuccess,
        data: {
          amount,
          txnRef,
          orderId,
          payDate,
          bankCode,
          bankTranNo,
          cartType,
          transactionNo,
        },
        message,
      };
    } else {
      return {
        isSuccess: false,
        message: "Invalid secure hash",
      };
    }
  }
}

function sortObject(obj) {
  const sorted = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = new VnpayService();

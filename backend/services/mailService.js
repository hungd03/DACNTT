require("dotenv").config();
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendEmailCreateOrder = async (orderData) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../public/mail-template/orderConfirmation.ejs"
    );

    const htmlContent = await ejs.renderFile(templatePath, {
      order: orderData,
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_ACCOUNT,
      to: orderData.shippingAddress.email,
      subject: `Order Confirmation ${orderData.orderId}`,
      html: htmlContent,
    });

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const sendOTPEmail = async (email, otp, fullName) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../public/mail-template/otp.ejs"
    );

    const htmlContent = await ejs.renderFile(templatePath, {
      user: { fullName },
      otp,
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_ACCOUNT,
      to: email,
      subject: "OTP Verification Code",
      html: htmlContent,
    });

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendEmailCreateOrder, sendOTPEmail };

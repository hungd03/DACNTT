require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const categoryRouter = require("./routes/categoryRoute");
const commentRouter = require("./routes/commentRoute");
const wishlistRouter = require("./routes/wishlistRoute");
const cartRouter = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRoute");

const app = express();

// Middleware
const verifyToken = require("./middlewares/Auth");

// Routers
app.use("/api/auth", authRouter);
app.use("/api/users", verifyToken, userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/comments", commentRouter);
app.use("/api/wishlist", verifyToken, wishlistRouter);
app.use("/api/carts", verifyToken, cartRouter);
app.use("/api/orders", orderRouter);

const connectDB = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const NODE_PORT = process.env.NODE_PORT;
    app.listen(NODE_PORT, () => {
      console.log(`Server is running on http://localhost:${NODE_PORT}`);
    });
  } catch (err) {
    console.log("Could not connect do DB", err);
    process.exit(1);
  }
};

connectDB();

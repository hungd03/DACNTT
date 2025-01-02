require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

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

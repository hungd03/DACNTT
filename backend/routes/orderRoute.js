const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrder,
  getOrdersOfUserByUserId,
  getOrderById,
  updateOrderById,
} = require("../controllers/orderController");

const verifyToken = require("../middlewares/Auth");

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getAllOrder);
router.get("/my-orders", verifyToken, getOrdersOfUserByUserId);
router.get("/:id", verifyToken, getOrderById);
router.put("/:id", verifyToken, updateOrderById);
module.exports = router;

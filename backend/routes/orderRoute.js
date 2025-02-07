const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrder,
  getOrderById,
  updateOrderById,
  cancelOrder,
} = require("../controllers/orderController");

const verifyToken = require("../middlewares/Auth");

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getAllOrder);
router.get("/:id", verifyToken, getOrderById);
router.patch("/:id", verifyToken, updateOrderById);
router.patch("/:id/cancel", verifyToken, cancelOrder);
module.exports = router;

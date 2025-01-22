const express = require("express");
const CartController = require("../controllers/cartController");
const verifyToken = require("../middlewares/Auth");
const isGuestOrAuthorized = require("../middlewares/optional");
const router = express.Router();

router.post("/", isGuestOrAuthorized, CartController.getCartItems);
router.post("/add", verifyToken, CartController.addItemToCart);
router.patch("/", verifyToken, CartController.updateItemQuantity);
router.delete(
  "/:productId/:sku",
  verifyToken,
  CartController.removeItemFormCart
);
router.delete("/", verifyToken, CartController.clearCart);

module.exports = router;

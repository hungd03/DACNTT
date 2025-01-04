const express = require("express");
const {
  addProductToWishlist,
  getWishlist,
  removeProductFromWishlist,
  removeAllProductFromWishlist,
} = require("../controllers/wishlistController");
const router = express.Router();

router.post("/", addProductToWishlist);
router.get("/", getWishlist);
router.delete("/:productId", removeProductFromWishlist);
router.delete("/", removeAllProductFromWishlist);
module.exports = router;

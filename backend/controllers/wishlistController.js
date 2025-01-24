const WishlistService = require("../services/wishlistService");

class WishlistController {
  async getWishlistItems(req, res) {
    try {
      let items;
      items = await WishlistService.getWishlistItems(req.user?.userId);

      if (items) {
        res.status(200).json({ success: true, items });
      } else {
        res
          .status(200)
          .json({ success: true, message: "Your wishlist is empty", items });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addItemToWishlist(req, res) {
    try {
      const userId = req.user.userId;
      const { productId } = req.body;
      const result = await WishlistService.addItemToWishlist(userId, productId);

      res.status(201).json({
        success: true,
        message: "Add product to wishlist successfully",
        result,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async removeItemFromWishlist(req, res) {
    try {
      const userId = req.user.userId;
      const { productId } = req.params;

      const result = await WishlistService.removeItemFromWishlist(
        userId,
        productId
      );

      res.status(200).json({
        success: true,
        message: "Remove product from wishlist successfully",
        result,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async clearWishlistItems(req, res) {
    try {
      const userId = req.user.userId;
      const result = await WishlistService.clearWishlistItems(userId);

      res.status(200).json({
        success: true,
        message: "Cleared wishlist successfully",
        result,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new WishlistController();

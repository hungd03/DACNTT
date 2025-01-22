const CartService = require("../services/cartService");

class CartController {
  async getCartItems(req, res) {
    try {
      let items;
      const clientItems = req.body.items || [];
      if (req?.user?.userId) {
        items = await CartService.getCartItemsByUser(req.user?.userId);
      } else {
        items = await CartService.getCartItemsFormData(clientItems);
      }
      if (items) {
        res.status(200).json({ success: true, items });
      } else {
        res
          .status(200)
          .json({ success: true, message: "Your cart is empty", items });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addItemToCart(req, res) {
    try {
      const userId = req.user.userId;
      const { productId, sku, quantity } = req.body;
      const result = await CartService.addItemToCart(
        userId,
        productId,
        sku,
        quantity
      );
      res.status(200).json({
        success: true,
        message: "Add item to cart successfully",
        result,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateItemQuantity(req, res) {
    try {
      const userId = req.user.userId;
      const { productId, sku, delta } = req.body;
      const updateResult = await CartService.updateItemQuantity(
        userId,
        productId,
        sku,
        delta
      );

      res.status(200).json({
        success: true,
        message: "Update item quantity successfully",
        updateResult,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async removeItemFormCart(req, res) {
    try {
      const userId = req.user.userId;
      const { productId, sku } = req.params;

      const result = await CartService.removeItemFormCart(
        userId,
        productId,
        sku
      );
      res.status(200).json({
        success: true,
        message: "Remove item from cart successfully",
        result,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async clearCart(req, res) {
    try {
      const userId = req.user.userId;
      const result = await CartService.clearCart(userId);
      res.status(200).json({
        success: true,
        message: "Cleared cart successfully",
        result,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CartController();

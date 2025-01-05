const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/Auth");
const ProductController = require("../controllers/productController");

// Public routes
router.get("/", ProductController.getAllProducts);
router.get(
  "/subcategory/:slug",
  ProductController.getProductsBySubcategorySlug
);
router.get("/flash-sale", ProductController.getFlashSale);
router.get("/search", ProductController.searchProducts);
router.get("/slug/:slug", ProductController.getProductBySlug);
router.get("/:id", ProductController.getProductById);

// Admin only routes
router.post("/", verifyToken, ProductController.createProduct);
router.put("/:id", verifyToken, ProductController.updateProduct);
router.delete("/:id", verifyToken, ProductController.deleteProduct);
module.exports = router;

const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");

// Public routes
router.get("/", ProductController.getAllProducts);
router.get("/slug/:slug", ProductController.getProductBySlug);
router.get("/:id", ProductController.getProductById);

module.exports = router;

const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/Auth");
const ProductController = require("../controllers/productController");
const { upload } = require("../configs/uploadConfig");
const {
  processProductImages,
  processVariantImage,
  deleteImages,
  handleMulterError,
} = require("../controllers/uploadController");

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
router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "thumbnailImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  handleMulterError,
  processProductImages,
  ProductController.updateProduct
);
router.delete(
  "/:id",
  verifyToken,
  deleteImages,
  ProductController.deleteProduct
);
router.patch("/:id/stock", verifyToken, ProductController.updateProductStock);

router.post(
  "/:productId/variants",
  verifyToken,
  upload.single("variantImage"),
  handleMulterError,
  processVariantImage,
  ProductController.addVariant
);
router.put(
  "/:productId/variants/:variantId",
  verifyToken,
  upload.single("variantImage"),
  handleMulterError,
  processVariantImage,
  ProductController.updateVariant
);
router.delete(
  "/:productId/variants/:variantId",
  verifyToken,
  deleteImages,
  ProductController.deleteVariant
);

router.put(
  "/:productId/discount",
  verifyToken,
  ProductController.updateDiscount
);

router.post("/:productId/videos", verifyToken, ProductController.addVideo);
router.put(
  "/:productId/videos/:videoId",
  verifyToken,
  ProductController.updateVideo
);
router.delete(
  "/:productId/videos/:videoId",
  verifyToken,
  ProductController.deleteVideo
);

module.exports = router;

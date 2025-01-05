const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const {
  processCategoryImage,
  handleMulterError,
} = require("../controllers/uploadController");
const { upload } = require("../configs/uploadConfig");

router.get("/", categoryController.getAllCategories);
router.get("/parents", categoryController.getAllParentCategories);
router.get("/id/:id", categoryController.getAllSubCategories);
router.get("/slug/:slug", categoryController.getCategoryBySlug);

router.post(
  "/",
  upload.single("image"),
  handleMulterError,
  processCategoryImage,
  categoryController.createCategory
);
router.put(
  "/:id",
  upload.single("image"),
  handleMulterError,
  processCategoryImage,
  categoryController.updateCategory
);
router.patch("/:id/visibility", categoryController.toggleVisibility);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;

const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getAllCategories);
router.get("/parents", categoryController.getAllParentCategories);
router.get("/id/:id", categoryController.getAllSubCategories);
router.get("/slug/:slug", categoryController.getCategoryBySlug);

router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.patch("/:id/visibility", categoryController.toggleVisibility);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;

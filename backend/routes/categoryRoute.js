const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getAllCategories);
router.get("/parents", categoryController.getAllParentCategories);
router.get("/id/:id", categoryController.getAllSubCategories);

module.exports = router;

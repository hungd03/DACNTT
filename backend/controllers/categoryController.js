const categoryService = require("../services/categoryService");

class CategoryController {
  async getAllCategories(req, res) {
    try {
      const categories = await categoryService.getAllCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllParentCategories(req, res) {
    try {
      const categories = await categoryService.getAllParentCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllSubCategories(req, res) {
    try {
      const category = await categoryService.getAllSubCategories(req.params.id);
      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }
      res.json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createCategory(req, res) {
    try {
      const category = await categoryService.createCategory(req.body, req.file);
      res.status(201).json({ success: true, data: category });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateCategory(req, res) {
    try {
      const category = await categoryService.updateCategory(
        req.params.id,
        req.body,
        req.file
      );
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
      res.json({ success: true, data: category });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      await categoryService.deleteCategory(req.params.id);
      res.json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async toggleVisibility(req, res) {
    try {
      const category = await categoryService.toggleCategoryVisibility(
        req.params.id
      );
      res.json({ success: true, data: category });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getCategoryBySlug(req, res) {
    try {
      const category = await categoryService.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }
      res.json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async incrementProductCount(req, res) {
    try {
      await categoryService.incrementProductCount(req.params.id);
      res.json({
        success: true,
        message: "Product count incremented successfully",
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async decrementProductCount(req, res) {
    try {
      await categoryService.decrementProductCount(req.params.id);
      res.json({
        success: true,
        message: "Product count decremented successfully",
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async recalculateCount(req, res) {
    try {
      await categoryService.recalculateProductCount(req.params.id);
      res.json({
        success: true,
        message: "Product count recalculated successfully",
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CategoryController();

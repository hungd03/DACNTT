const Category = require("../models/Category");
const mongoose = require("mongoose");

class CategoryService {
  async getAllCategories() {
    return await Category.find({ parent: null, isHide: false }).sort({
      order: 1,
    });
  }

  async getAllParentCategories() {
    return await Category.find({ parent: null, isHide: false })
      .setOptions({ skipPopulate: true })
      .sort({ order: 1 });
  }

  async getAllSubCategories(id) {
    return await Category.find({ parent: id, isHide: false }).sort({
      order: 1,
    });
  }
}
module.exports = new CategoryService();

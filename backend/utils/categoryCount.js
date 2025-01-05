const CategoryService = require("../services/categoryService");

async function handleCategoryCount(currentProduct, updateData) {
  if (
    updateData.category !== undefined ||
    updateData.subcategory !== undefined
  ) {
    if (!currentProduct) {
      throw new Error("Product not found");
    }

    // Xử lý subcategory
    if (
      currentProduct.subcategory &&
      String(currentProduct.subcategory) !== String(updateData.subcategory)
    ) {
      await CategoryService.decrementProductCount(currentProduct.subcategory);
      if (updateData.subcategory) {
        await CategoryService.incrementProductCount(updateData.subcategory);
      }
    }
  }
}

module.exports = handleCategoryCount;

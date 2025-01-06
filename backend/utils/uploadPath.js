const getUserAvatarPath = (userSlug) => {
  return `ecommerce/users/${userSlug}/avatar`;
};

const getProductImagePath = (productSlug) => {
  return {
    thumbnail: `ecommerce/products/${productSlug}/thumbnail`,
    gallery: `ecommerce/products/${productSlug}/gallery`,
    variants: `ecommerce/products/${productSlug}/variants`,
    seo: `ecommerce/products/${productSlug}/seo`,
  };
};

const getCategoryImagePath = (parentCategory, subCategory) => {
  if (subCategory) {
    return `ecommerce/categories/${parentCategory}/${subCategory}`;
  }
  return `ecommerce/categories/${parentCategory}`;
};

module.exports = {
  getUserAvatarPath,
  getProductImagePath,
  getCategoryImagePath,
};

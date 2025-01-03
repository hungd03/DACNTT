const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloudinaryConfig");
const Category = require("../models/Category");
const Product = require("../models/Product");
const {
  getUserAvatarPath,
  getProductImagePath,
  getCategoryImagePath,
} = require("../utils/uploadPaths");
const { convertToSlug } = require("../utils/formatPath");

// Helper function để xác định folder dựa vào route và request
const determineUploadFolder = async (req, file) => {
  const path = req.originalUrl;

  // Xử lý upload cho category
  if (path.includes("/categories")) {
    const parentCategory = req.body.parent
      ? convertToSlug((await Category.findById(req.body.parent))?.name || "")
      : convertToSlug(req.body.name);
    const subCategory = req.body.parent ? convertToSlug(req.body.name) : null;
    return getCategoryImagePath(parentCategory, subCategory);
  }

  // Xử lý upload cho product
  if (path.includes("/products")) {
    try {
      const pathType =
        {
          thumbnailImage: "thumbnail",
          images: "gallery",
          variantImage: "variants",
          seoImage: "seo",
        }[file.fieldname] || "thumbnail";

      let slug;
      if (path.includes("/variants")) {
        slug = req.body.sku.toLowerCase();
      } else {
        const productId = path.split("/products/")[1].split("/")[0];
        const product = await Product.findById(productId);
        slug = product
          ? convertToSlug(product.name)
          : req.body.name || req.body.title || "unknown";
      }

      return getProductImagePath(slug)[pathType];
    } catch (error) {
      console.error("Error determining upload folder:", error);
      return "ecommerce/products/undefined";
    }
  }

  // Xử lý upload cho user
  if (path.includes("/users")) {
    const userSlug = convertToSlug(req.body.fullName);
    return getUserAvatarPath(userSlug);
  }

  // Default folder nếu không match case nào
  return "ecommerce/uploads";
};

// Cấu hình CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: determineUploadFolder,
    resource_type: "auto",
    allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
  },
});

// Cấu hình multer với storage đã tạo
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

module.exports = { upload };

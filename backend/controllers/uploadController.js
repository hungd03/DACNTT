const multer = require("multer");
const uploadService = require("../services/uploadService");
const Product = require("../models/Product");
const Category = require("../models/Category");

// Generic handler for processing image uploads
const handleImageUpload = async (options) => {
  const {
    req,
    fieldName,
    existingData,
    isSingle = true,
    parentField = null,
  } = options;

  // If no file(s) uploaded, return null to skip processing
  if (!req.file && !req.files) return null;

  // Get uploaded file(s)
  const files = isSingle
    ? req.file
      ? [req.file]
      : []
    : req.files?.[fieldName] || [];

  if (!files || (Array.isArray(files) && files.length === 0)) return null;

  // Delete existing images if updating
  if (existingData) {
    if (isSingle && existingData?.publicId) {
      await uploadService.deleteImage(existingData.publicId);
    } else if (!isSingle && existingData?.length > 0) {
      const publicIds = existingData.map((img) => img.publicId);
      await uploadService.deleteMultipleImages(publicIds);
    }
  }

  // Format new image data
  const formatImage = (file) => ({
    url: file.path,
    publicId: file.filename,
  });

  // Return formatted image data
  const newImageData = isSingle
    ? formatImage(files[0])
    : files.map(formatImage);

  // If there's a parent field, nest the image data
  if (parentField) {
    return {
      [parentField]: {
        ...req.body[parentField],
        image: newImageData,
      },
    };
  }

  // Return the image data with the specified field name
  return {
    [fieldName]: newImageData,
  };
};

const handleProductImageUpload = async (options) => {
  const { req, fieldName, existingData, isSingle = true } = options;

  if (req.files?.[fieldName]) {
    const files = isSingle ? [req.files[fieldName][0]] : req.files[fieldName];

    const formatImage = (file) => ({
      url: file.path,
      publicId: file.filename,
    });

    const newImageData = isSingle
      ? formatImage(files[0])
      : files.map(formatImage);

    return {
      [fieldName]: newImageData,
    };
  }

  return null;
};

const processCategoryImage = async (req, res, next) => {
  try {
    const category = req.params.id
      ? await Category.findById(req.params.id)
      : null;

    const imageData = await handleImageUpload({
      req,
      fieldName: "image",
      existingData: category?.image,
      isSingle: true,
    });

    if (imageData) {
      req.body = {
        ...req.body,
        ...imageData,
      };
    }

    next();
  } catch (error) {
    next(error);
  }
};

const processProductImages = async (req, res, next) => {
  try {
    const product = req.params.id
      ? await Product.findById(req.params.id)
      : null;

    const imageTypes = [
      {
        fieldName: "thumbnailImage",
        existingData: product?.thumbnailImage,
        isSingle: true,
      },
      {
        fieldName: "images",
        existingData: product?.images,
        isSingle: false,
      },
    ];

    for (const imageType of imageTypes) {
      const imageData = await handleProductImageUpload({
        req,
        ...imageType,
      });

      if (imageData) {
        req.body = {
          ...req.body,
          ...imageData,
        };
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

const processVariantImage = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) throw new Error("Product not found");
    console.log("Before Process", req.body);
    const variant = product.variants.id(req.params.variantId);

    const imageData = await handleImageUpload({
      req,
      fieldName: "variantImage",
      existingData: variant?.variantImage,
      isSingle: true,
    });

    if (imageData) {
      req.body = {
        ...req.body,
        ...imageData,
      };
    }
    console.log("After Process", req.body);
    next();
  } catch (error) {
    next(error);
  }
};

const deleteImages = async (req, res, next) => {
  try {
    const path = req.originalUrl.toLowerCase();
    let model;

    if (path.includes("/products")) {
      // Check if it's a SEO delete request
      if (path.includes("/seo")) {
        model = await Product.findById(req.params.productId);
        if (!model) throw new Error("Product not found");

        if (model.seo?.seoImage?.publicId) {
          await uploadService.deleteImage(model.seo.seoImage.publicId);
        }
      }
      // Check if it's a variant delete request
      else if (path.includes("/variants")) {
        model = await Product.findById(req.params.productId);
        if (!model) throw new Error("Product not found");

        const variant = model.variants.id(req.params.variantId);
        if (!variant) throw new Error("Variant not found");

        if (variant.variantImage?.publicId) {
          await uploadService.deleteImage(variant.variantImage.publicId);
        }
      }
      // Handle full product delete
      else {
        model = await Product.findById(req.params.id);
        if (!model) throw new Error("Product not found");

        const deletePromises = [];

        // Delete thumbnail image
        if (model.thumbnailImage?.publicId) {
          deletePromises.push(
            uploadService.deleteImage(model.thumbnailImage.publicId)
          );
        }

        // Delete gallery images
        if (model.images?.length > 0) {
          const galleryIds = model.images.map((img) => img.publicId);
          deletePromises.push(uploadService.deleteMultipleImages(galleryIds));
        }

        // Delete SEO image
        if (model.seo?.seoImage?.publicId) {
          deletePromises.push(
            uploadService.deleteImage(model.seo.seoImage.publicId)
          );
        }

        // Delete all variant images
        if (model.variants?.length > 0) {
          const variantIds = model.variants
            .filter((variant) => variant.variantImage?.publicId)
            .map((variant) => variant.variantImage.publicId);

          if (variantIds.length > 0) {
            deletePromises.push(uploadService.deleteMultipleImages(variantIds));
          }
        }

        await Promise.all(deletePromises);
      }
    } else if (path.includes("/users")) {
      model = await User.findById(req.params.id || req.user.id);
      if (!model) throw new Error("User not found");

      if (model.avatar?.publicId) {
        await uploadService.deleteImage(model.avatar.publicId);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size cannot exceed 2MB",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
};

module.exports = {
  processCategoryImage,
  processProductImages,
  processVariantImage,
  deleteImages,
  handleMulterError,
};

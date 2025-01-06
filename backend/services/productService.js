const Product = require("../models/Product");
const CategoryService = require("./categoryService");
const Category = require("../models/Category");
const handleCategoryCount = require("../utils/categoryCount");

class ProductService {
  async getAllProducts(query) {
    const { page = 1, limit = 10 } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(),
    ]);

    return {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id).populate(
        "category subcategory"
      );

      if (!product) {
        return null;
      }

      const relatedProducts = await this.getRelatedProducts(product);

      return {
        ...product.toObject(),
        relatedProducts,
      };
    } catch (error) {
      throw error;
    }
  }

  async getProductBySlug(slug) {
    try {
      const product = await Product.findOne({ slug }).populate(
        "category subcategory"
      );

      if (!product) {
        return null;
      }

      const relatedProducts = await this.getRelatedProducts(product);

      return {
        ...product.toObject(),
        relatedProducts,
      };
    } catch (error) {
      throw error;
    }
  }

  async getProductsBySubcategorySlug(slug, page = 1, limit = 12) {
    try {
      const subcategory = await Category.findOne({
        slug: slug,
        parent: { $ne: null },
      });

      if (!subcategory) {
        return {
          success: false,
          message: "Subcategory not found",
        };
      }

      // Tính total và skip
      const total = await Product.countDocuments({
        subcategory: subcategory._id,
        status: "Active",
      });

      const skip = (page - 1) * limit;

      const products = await Product.find({
        subcategory: subcategory._id,
        status: "Active",
      })
        .select(
          "name slug brand variants basePrice minPrice maxPrice thumbnailImage discount ratings soldCount"
        )
        .sort({ soldCount: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "subcategory",
          select: "name slug",
        });

      return {
        success: true,
        data: {
          subcategory,
          products,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
          },
        },
        message: "Products retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getFlashSale(limit) {
    try {
      const query = {
        status: "Active",
        "discount.isActive": true,
        "discount.endDate": { $gt: new Date() },
        "discount.startDate": { $lte: new Date() },
      };

      if (limit) {
        return await Product.find(query)
          .sort({ "discount.value": -1 })
          .limit(limit);
      }
      const { page = 1, limit: pageLimit = 10 } = query;
      const skip = (Number(page) - 1) * Number(pageLimit);

      const [products, total] = await Promise.all([
        Product.find(query)
          .sort({ "discount.value": -1 })
          .skip(skip)
          .limit(Number(pageLimit)),
        Product.countDocuments(query),
      ]);

      return {
        products,
        pagination: {
          page: Number(page),
          limit: Number(pageLimit),
          total,
          pages: Math.ceil(total / Number(pageLimit)),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getRelatedProducts(sourceProduct) {
    // Lấy chính xác 5 sản phẩm liên quan
    const RELATED_PRODUCTS_LIMIT = 5;

    const query = {
      _id: { $ne: sourceProduct._id },
      status: "Active",
      $or: [
        { brand: sourceProduct.brand },
        { subcategory: sourceProduct.subcategory },
      ],
    };

    return await Product.find(query).limit(RELATED_PRODUCTS_LIMIT).sort({
      "ratings.average": -1,
      soldCount: -1,
    });
  }

  async createProduct(productData) {
    try {
      const product = new Product(productData);
      await product.save();

      if (product.subcategory) {
        await CategoryService.incrementProductCount(product.subcategory);
      }

      return product;
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async updateProduct(id, updateData) {
    try {
      const currentProduct = await Product.findById(id);
      if (!currentProduct) {
        throw new Error("Product not found");
      }

      const mergedProduct = {
        ...currentProduct.toObject(),
        ...updateData,
      };

      await handleCategoryCount(currentProduct, mergedProduct);

      await Product.replaceOne({ _id: id }, mergedProduct, {
        runValidators: true,
      });

      return await Product.findById(id).populate("category subcategory");
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        throw new Error("Product not found");
      }

      if (product.subcategory) {
        await CategoryService.decrementProductCount(product.subcategory);
      }

      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  async searchProducts(query, page = 1) {
    try {
      const skip = (Number(page) - 1) * Number(16);

      // Sanitize query trước khi tìm kiếm
      const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(sanitizedQuery, "i");

      const searchCondition = {
        status: "Active",
        $or: [
          { name: { $regex: searchRegex } },
          { "variants.color": { $regex: searchRegex } },
          { brand: { $regex: searchRegex } },
        ],
      };

      const result = await Product.find(searchCondition)
        .select(
          "slug name basePrice ratings thumbnailImage variants.name variants.sku variants.price variant.stock variants.thumbnail"
        )
        .skip(skip)
        .limit(16)
        .lean()
        .exec();

      const totalItems = await Product.countDocuments(searchCondition);

      return {
        products: result,
        pagination: {
          page: page,
          limit: 16,
          total: totalItems,
          pages: Math.ceil(totalItems / 16),
        },
      };
    } catch (error) {
      throw new Error(`Search error: ${error.message}`);
    }
  }

  async updateProductStock(id, variantSku, quantity) {
    return await Product.findOneAndUpdate(
      { _id: id, "variants.sku": variantSku },
      { $inc: { "variants.$.stock": quantity } },
      { new: true }
    );
  }

  async getVariants(productId) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      return product.variants;
    } catch (error) {
      throw error;
    }
  }

  async getVariantById(productId, variantId) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      const variant = product.variants.id(variantId);
      if (!variant) {
        throw new Error("Variant not found");
      }
      return variant;
    } catch (error) {
      throw error;
    }
  }

  async addVariant(productId, variantData) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      product.variants.push(variantData);
      return await product.save();
    } catch (error) {
      throw error;
    }
  }

  async updateVariant(productId, variantId, updateData) {
    try {
      updateData._id = variantId;
      return await Product.findOneAndUpdate(
        { _id: productId, "variants._id": variantId },
        { $set: { "variants.$": updateData } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteVariant(productId, variantId) {
    try {
      return await Product.findByIdAndUpdate(
        productId,
        { $pull: { variants: { _id: variantId } } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async updateProductDiscount(productId, discountData) {
    try {
      return await Product.findByIdAndUpdate(
        productId,
        { discount: discountData },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async removeProductDiscount(productId) {
    try {
      return await Product.findByIdAndUpdate(
        productId,
        { $unset: { discount: 1 } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async getVideos(productId) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      return product.videos;
    } catch (error) {
      throw error;
    }
  }

  async getVideoById(productId, videoId) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      const video = product.videos.id(videoId);
      if (!video) {
        throw new Error("Video not found");
      }
      return video;
    } catch (error) {
      throw error;
    }
  }

  async addProductVideo(productId, videoData) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      product.videos.push(videoData);
      return await product.save();
    } catch (error) {
      throw error;
    }
  }

  async updateProductVideo(productId, videoId, updateData) {
    try {
      updateData._id = videoId;
      return await Product.findOneAndUpdate(
        { _id: productId, "videos._id": videoId },
        { $set: { "videos.$": updateData } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteProductVideo(productId, videoId) {
    try {
      return await Product.findByIdAndUpdate(
        productId,
        { $pull: { videos: { _id: videoId } } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new ProductService();

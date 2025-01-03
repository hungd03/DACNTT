const Product = require("../models/Product");
const CategoryService = require("./categoryService");

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
}
module.exports = new ProductService();

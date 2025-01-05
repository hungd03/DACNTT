const ProductService = require("../services/productService");

class ProductController {
  async getAllProducts(req, res) {
    try {
      const result = await ProductService.getAllProducts(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProductBySlug(req, res) {
    try {
      const product = await ProductService.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProductsBySubcategorySlug(req, res) {
    try {
      const { slug } = req.params;
      const { page = 1, limit = 20 } = req.query;

      if (!slug) {
        return res.status(400).json({
          success: false,
          message: "Subcategory slug is required",
        });
      }

      const result = await ProductService.getProductsBySubcategorySlug(
        slug,
        page,
        limit
      );

      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getFlashSale(req, res) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : null;
      const result = await ProductService.getFlashSale(limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await ProductService.updateProduct(
        req.params.id,
        req.body
      );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const product = await ProductService.deleteProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async searchProducts(req, res) {
    const page = parseInt(req.query.page) || 1;
    try {
      const products = await ProductService.searchProducts(req.query.q, page);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProductController();

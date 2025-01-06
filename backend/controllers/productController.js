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

  async updateProductStock(req, res) {
    try {
      const { variantSku, quantity } = req.body;
      const product = await ProductService.updateProductStock(
        req.params.id,
        variantSku,
        quantity
      );
      if (!product) {
        return res
          .status(404)
          .json({ message: "Product or variant not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getVariants(req, res) {
    try {
      const variants = await ProductService.getVariants(req.params.productId);
      res.json(variants);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getVariantById(req, res) {
    try {
      const variant = await ProductService.getVariantById(
        req.params.productId,
        req.params.variantId
      );
      if (!variant) {
        return res.status(404).json({ message: "Variant not found" });
      }
      res.json(variant);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addVariant(req, res) {
    console.log(req.body);
    try {
      const product = await ProductService.addVariant(
        req.params.productId,
        req.body
      );
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateVariant(req, res) {
    try {
      const product = await ProductService.updateVariant(
        req.params.productId,
        req.params.variantId,
        req.body
      );
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteVariant(req, res) {
    try {
      const product = await ProductService.deleteVariant(
        req.params.productId,
        req.params.variantId
      );
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateDiscount(req, res) {
    try {
      const product = await ProductService.updateProductDiscount(
        req.params.productId,
        req.body
      );
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async removeDiscount(req, res) {
    try {
      const product = await ProductService.removeProductDiscount(
        req.params.productId
      );
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getVideos(req, res) {
    try {
      const videos = await ProductService.getVideos(req.params.productId);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getVideoById(req, res) {
    try {
      const video = await ProductService.getVideoById(
        req.params.productId,
        req.params.videoId
      );
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addVideo(req, res) {
    try {
      const product = await ProductService.addProductVideo(
        req.params.productId,
        req.body
      );
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateVideo(req, res) {
    try {
      const product = await ProductService.updateProductVideo(
        req.params.productId,
        req.params.videoId,
        req.body
      );
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteVideo(req, res) {
    try {
      const product = await ProductService.deleteProductVideo(
        req.params.productId,
        req.params.videoId
      );
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProductController();

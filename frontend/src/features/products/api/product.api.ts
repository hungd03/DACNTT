import { axiosInstance } from "@/lib/axiosInstance";
import { Category } from "@/types/category";
import {
  ProductDetail,
  ProductVideo,
  ProductListResponse,
  ProductPagination,
  ProductFilterParams,
} from "@/types/product";

export const productApi = {
  getProducts: async (
    filters: ProductPagination
  ): Promise<ProductListResponse> => {
    const response = await axiosInstance.get("/products", { params: filters });
    return response.data;
  },

  getFlashSale: async (limit?: number): Promise<ProductListResponse> => {
    const response = await axiosInstance.get("/products/flash-sale", {
      params: { limit },
    });
    return response.data;
  },

  getProductById: async (id: string): Promise<ProductDetail> => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  getProductBySlug: async (slug: string): Promise<ProductDetail> => {
    const response = await axiosInstance.get(`/products/slug/${slug}`);
    return response.data;
  },

  getProductsBySubcategory: async (
    slug: string,
    pagination?: ProductPagination
  ): Promise<{
    subcategory: Category;
    products: ProductDetail[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    const response = await axiosInstance.get(`/products/subcategory/${slug}`, {
      params: pagination,
    });
    return response.data.data;
  },

  createProduct: async (productData: FormData): Promise<ProductDetail> => {
    const response = await axiosInstance.post("/products", productData);
    return response.data;
  },

  updateProduct: async (
    id: string,
    productData: FormData
  ): Promise<ProductDetail> => {
    const response = await axiosInstance.put(`/products/${id}`, productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
  },

  getFilteredProducts: async (
    params: ProductFilterParams
  ): Promise<ProductListResponse> => {
    const queryParams = new URLSearchParams();

    // Add non-empty params to query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const response = await axiosInstance.get(
      `/products/filter?${queryParams.toString()}`
    );
    return response.data;
  },

  searchProducts: async (
    q: string,
    page: number = 1
  ): Promise<ProductListResponse> => {
    const response = await axiosInstance.get("/products/search", {
      params: { q, page },
    });
    return response.data;
  },

  // Variant methods
  getVariants: async (
    productId: string
  ): Promise<ProductDetail["variants"]> => {
    const response = await axiosInstance.get(`/products/${productId}/variants`);
    return response.data;
  },

  addVariant: async (
    productId: string,
    variantData: FormData
  ): Promise<ProductDetail> => {
    const response = await axiosInstance.post(
      `/products/${productId}/variants`,
      variantData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  updateVariant: async (
    productId: string,
    variantId: string,
    variantData: FormData
  ): Promise<ProductDetail> => {
    const response = await axiosInstance.put(
      `/products/${productId}/variants/${variantId}`,
      variantData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteVariant: async (
    productId: string,
    variantId: string
  ): Promise<ProductDetail> => {
    const response = await axiosInstance.delete(
      `/products/${productId}/variants/${variantId}`
    );
    return response.data;
  },

  // Discount methods
  updateDiscount: async (
    productId: string,
    discountData: ProductDetail["discount"]
  ): Promise<ProductDetail> => {
    const response = await axiosInstance.put(
      `/products/${productId}/discount`,
      discountData
    );
    return response.data;
  },

  // SEO methods
  updateSEO: async (
    productId: string,
    seoData: FormData
  ): Promise<ProductDetail> => {
    const response = await axiosInstance.put(
      `/products/${productId}/seo`,
      seoData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  deleteSEO: async (productId: string): Promise<ProductDetail> => {
    const response = await axiosInstance.delete(`/products/${productId}/seo`);
    return response.data;
  },

  // Video methods
  getVideos: async (productId: string): Promise<ProductVideo[]> => {
    const response = await axiosInstance.get(`/products/${productId}/videos`);
    return response.data;
  },

  getVideoById: async (
    productId: string,
    videoId: string
  ): Promise<ProductVideo> => {
    const response = await axiosInstance.get(
      `/products/${productId}/videos/${videoId}`
    );
    return response.data;
  },

  addVideo: async (
    productId: string,
    videoData: Omit<ProductVideo, "_id">
  ): Promise<ProductDetail> => {
    const response = await axiosInstance.post(
      `/products/${productId}/videos`,
      videoData
    );
    return response.data;
  },

  updateVideo: async (
    productId: string,
    videoId: string,
    videoData: Omit<ProductVideo, "_id">
  ): Promise<ProductDetail> => {
    const response = await axiosInstance.put(
      `/products/${productId}/videos/${videoId}`,
      videoData
    );
    return response.data;
  },

  deleteVideo: async (
    productId: string,
    videoId: string
  ): Promise<ProductDetail> => {
    const response = await axiosInstance.delete(
      `/products/${productId}/videos/${videoId}`
    );
    return response.data;
  },
};

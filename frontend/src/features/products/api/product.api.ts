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
};

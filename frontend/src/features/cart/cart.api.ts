import { axiosInstance } from "@/lib/axiosInstance";

export const cartApi = {
  getCart: () => {
    return axiosInstance.get("/cart");
  },

  addToCart: (productId: string, sku: string, quantity: number) => {
    return axiosInstance.post("/cart", { productId, sku, quantity });
  },

  updateQuantity: (productId: string, sku: string, delta: number) => {
    return axiosInstance.put("/cart", { productId, sku, delta });
  },

  removeItem: (productId: string, sku: string) => {
    return axiosInstance.delete(`/cart/${productId}/${sku}`);
  },

  clearCart: () => {
    return axiosInstance.delete("/cart");
  },
};

import { axiosInstance } from "@/lib/axiosInstance";
import { WishlistResponse } from "@/types/wishlist";

const BASE_URL = "/wishlist";

export const wishlistApi = {
  getItems: async (): Promise<WishlistResponse> => {
    const { data } = await axiosInstance.get(BASE_URL);
    return data;
  },

  addItem: async (productId: string): Promise<WishlistResponse> => {
    const { data } = await axiosInstance.post(BASE_URL, { productId });
    return data;
  },

  removeItem: async (productId: string): Promise<WishlistResponse> => {
    const { data } = await axiosInstance.delete(`${BASE_URL}/${productId}`);
    return data;
  },

  clearItems: async (): Promise<WishlistResponse> => {
    const { data } = await axiosInstance.delete(BASE_URL);
    return data;
  },
};

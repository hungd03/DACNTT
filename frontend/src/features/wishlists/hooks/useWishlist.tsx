/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { axiosInstance } from "@/lib/axiosInstance";
import { useAuth } from "@/features/auth/hooks/useAuth";
import toast from "react-hot-toast";
import { useEffect } from "react";

// Define types
type WishlistStore = {
  items: string[];
  count: number;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearItems: () => Promise<void>;
  initializeFromServer: () => Promise<void>;
  syncWithLocalStorage: () => void;
  setItems: (items: string[]) => void;
};

// Create Zustand store
const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  count: 0,
  addItem: async (productId) => {
    const currentItems = get().items;
    // Kiểm tra nếu sản phẩm chưa có trong wishlist
    if (!currentItems.includes(productId)) {
      const newItems = [...currentItems, productId];
      set({
        items: newItems,
        count: newItems.length,
      });
      get().syncWithLocalStorage();
    }
  },
  removeItem: async (productId) => {
    const newItems = get().items.filter((id) => id !== productId);
    set({
      items: newItems,
      count: newItems.length,
    });
    get().syncWithLocalStorage();
  },
  clearItems: async () => {
    set({ items: [], count: 0 });
    get().syncWithLocalStorage();
  },
  initializeFromServer: async () => {
    try {
      const response = await axiosInstance.get("/wishlist");
      if (response.data.status) {
        const productIds = response.data.data.products.map(
          (product: any) => product._id
        );
        set({
          items: productIds,
          count: productIds.length,
        });
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  },
  syncWithLocalStorage: () => {
    const { items } = get();
    localStorage.setItem("wishlist", JSON.stringify(items));
  },
  setItems: (items: string[]) => {
    set({
      items,
      count: items.length,
    });
  },
}));

// Custom hook to use wishlist
// Custom hook to use wishlist
export const useWishlist = () => {
  const { isLoggedIn } = useAuth();
  // Sử dụng selector thay vì store trực tiếp
  const items = useWishlistStore((state) => state.items);
  const count = useWishlistStore((state) => state.count);
  const setItems = useWishlistStore((state) => state.setItems);
  const addItem = useWishlistStore((state) => state.addItem);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearItems = useWishlistStore((state) => state.clearItems);
  const initializeFromServer = useWishlistStore(
    (state) => state.initializeFromServer
  );

  // Initialize wishlist from localStorage or server
  useEffect(() => {
    const initWishlist = async () => {
      if (isLoggedIn) {
        await initializeFromServer();
      } else {
        const savedWishlist = localStorage.getItem("wishlist");
        if (savedWishlist) {
          const savedItems = JSON.parse(savedWishlist);
          setItems(savedItems);
        }
      }
    };

    initWishlist();
  }, [isLoggedIn, initializeFromServer, setItems]);

  const addToWishlist = async (productId: string) => {
    try {
      if (isLoggedIn) {
        const response = await axiosInstance.post("/wishlist", {
          product: productId,
        });
        if (response.data.status) {
          await addItem(productId);
          toast.success("Product added to wishlist");
        }
      } else {
        await addItem(productId);
        toast.success("Product added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to add product to wishlist");
      console.error("Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      if (isLoggedIn) {
        const response = await axiosInstance.delete(`/wishlist/${productId}`);
        if (response.data.status) {
          await removeItem(productId);
          toast.success("Product removed from wishlist");
        }
      } else {
        await removeItem(productId);
        toast.success("Product removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to remove product from wishlist");
      console.error("Error removing from wishlist:", error);
    }
  };

  const clearWishlist = async () => {
    try {
      if (isLoggedIn) {
        const response = await axiosInstance.delete("/wishlist");
        if (response.data.status) {
          await clearItems();
          toast.success("Wishlist cleared");
        }
      } else {
        await clearItems();
        toast.success("Wishlist cleared");
      }
    } catch (error) {
      toast.error("Failed to clear wishlist");
      console.error("Error clearing wishlist:", error);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.includes(productId);
  };

  return {
    wishlistCount: count,
    items,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  };
};

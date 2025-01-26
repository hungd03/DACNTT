import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { wishlistApi } from "./wishlist.api";
import { ApiError } from "@/types/ApiError";

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const invalidateWishlist = () =>
    queryClient.invalidateQueries({ queryKey: ["wishlist"] });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      try {
        const response = await wishlistApi.getItems();
        return response.items || [];
      } catch (error) {
        toast.error("Failed to fetch wishlist items");
        return [];
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: wishlistApi.addItem,
    onSuccess: () => {
      toast.success("Added to wishlist");
      invalidateWishlist();
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to add item to wishlist"
      );
    },
  });

  const removeMutation = useMutation({
    mutationFn: wishlistApi.removeItem,
    onSuccess: () => {
      toast.success("Removed from wishlist");
      invalidateWishlist();
    },
    onError: (error: ApiError) => {
      toast.error(
        error.response?.data?.message || "Failed to add item to wishlist"
      );
    },
  });

  const clearMutation = useMutation({
    mutationFn: wishlistApi.clearItems,
    onSuccess: () => {
      toast.success("Wishlist cleared");
      invalidateWishlist();
    },
    onError: () => toast.error("Failed to clear wishlist"),
  });

  return {
    items,
    isLoading,
    addToWishlist: addMutation.mutateAsync,
    removeFromWishlist: removeMutation.mutateAsync,
    clearWishlist: clearMutation.mutateAsync,
  };
};

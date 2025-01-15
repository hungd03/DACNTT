"use client";
import ProductCards from "@/components/ProductCards";
import { useWishlist } from "@/features/wishlists/hooks/useWishlist";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axiosInstance";
import { ProductDetail } from "@/types/product";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProducts } from "@/features/products/hooks/useProduct";

const Wishlist = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { clearWishlist, wishlistCount, items } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState<ProductDetail[]>([]);

  const { data: productsData } = useProducts({
    ids: items || [],
    enabled: !isLoggedIn && items?.length > 0,
  });

  useEffect(() => {
    if (!isLoggedIn && productsData?.products && items?.length > 0) {
      const filteredProducts = productsData.products.filter((product) =>
        items.includes(product._id)
      );
      setWishlistProducts(filteredProducts);
    }
  }, [isLoggedIn, productsData, items]);

  const fetchWishlistData = async () => {
    try {
      const response = await axiosInstance.get("/wishlist");
      if (response.data.status) {
        setWishlistProducts(response.data.data.products);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlistData();
    }
  }, [isLoggedIn]);

  // Handle clear all
  const handleClearAll = async () => {
    await clearWishlist();
    if (isLoggedIn) {
      fetchWishlistData();
    } else {
      setWishlistProducts([]); // Clear local products
    }
  };

  // Handle remove từ wishlist
  const handleRemoveFromWishlist = async (productId: string) => {
    if (isLoggedIn) {
      try {
        const response = await axiosInstance.delete(`/wishlist/${productId}`);
        if (response.data.status) {
          fetchWishlistData();
        }
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    } else {
      // Cập nhật local products khi xóa item
      setWishlistProducts((prev) => prev.filter((p) => p._id !== productId));
    }
  };

  return (
    <div className="xl:container px-2 xl:px-4 py-12 mx-auto">
      <div className="flex items-center">
        <div className="flex items-center w-[50%]">
          <h1 className="text-xl md:text-4xl font-bold mb-0">Wishlist</h1>
          <span className="text-md md:text-xl ms-2 relative top-[1px]">
            ({wishlistCount} Products Found)
          </span>
        </div>
        <div className="w-full flex justify-end">
          {wishlistCount > 0 && (
            <button
              onClick={handleClearAll}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
      <div className="mt-5">
        {wishlistCount > 0 ? (
          <ProductCards
            data={wishlistProducts}
            wishlistClicked={handleRemoveFromWishlist}
          />
        ) : (
          <div className="text-center mt-10">
            <img
              src="/empty-wishlist.jpg"
              alt="Empty Wishlist"
              className="block mx-auto w-100 h-100"
            />
            <h2 className="text-3xl font-bold mt-4 text-gray-700">
              Your wishlist is empty
            </h2>
            <p className="text-lg text-gray-500 mt-2">
              Add items to make it happy!
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 mt-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

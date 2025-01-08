"use client";
import Link from "next/link";
import React from "react";
import { FaHeart } from "react-icons/fa";
import Image from "next/legacy/image";
import { formatCurrency } from "@/utils/currencyFormatter";
import { ProductDetail, ProductListResponse } from "@/types/product";
import { useWishlist } from "@/features/wishlists/hooks/useWishlist";
import { calculateDiscountedPrice } from "@/features/products/utils/product.util";

interface ProductCardProps {
  data: ProductDetail[] | ProductListResponse;
  isWishlisted?: boolean;
  wishlistClicked?: (id: string) => void;
  isFlashSale?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  data,
  isFlashSale = false,
}) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const products = data ? (Array.isArray(data) ? data : data.products) : [];
  const handleWishlistClick = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };
  const renderProductCard = (item: ProductDetail) => {
    const originalPrice = item.basePrice;
    const discountedPrice = calculateDiscountedPrice(
      originalPrice,
      item.discount
    );
    const discountPercent =
      item.discount?.isActive && item.discount.type === "percentage"
        ? item.discount.value
        : Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

    const totalStock = item.variants.reduce(
      (sum, variant) => sum + variant.stock,
      0
    );
    const totalSold = item.variants.reduce(
      (sum, variant) => sum + variant.soldCount,
      0
    );

    return (
      <div className="bg-white p-4 shadow-md rounded-lg flex flex-col">
        <div className="relative aspect-square rounded-lg flex-shrink-0">
          {/* Discount Tag */}
          {discountPercent > 0 && isFlashSale && (
            <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
              -{discountPercent}%
            </div>
          )}

          <Image
            src={item.thumbnailImage?.url || "https://placehold.co/200x200"}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg transform scale-95 hover:scale-100 transition duration-500 ease-in-out"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              handleWishlistClick(item._id);
            }}
            className="absolute top-2 right-2 z-10"
          >
            <FaHeart
              className={`w-5 h-5 ${
                isInWishlist(item._id) ? "text-red-500" : "text-gray-400"
              } hover:text-red-500 transition-colors`}
            />
          </button>
        </div>

        <div className="space-y-2 flex-grow">
          <h3 className="font-medium h-12">{item.name}</h3>

          <div className={`flex items-center ${isFlashSale ? "gap-2" : ""}`}>
            <div className="text-red-500 font-bold text-base">
              {formatCurrency(discountedPrice)}
            </div>
            {isFlashSale && discountPercent > 0 && (
              <div className="text-xs text-gray-500 line-through">
                {formatCurrency(originalPrice)}
              </div>
            )}
          </div>

          {isFlashSale ? (
            <>
              <div className="bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-red-500 h-full rounded-full"
                  style={{
                    width: `${(totalSold / totalStock) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-600">
                Đã bán {totalSold}/{totalStock}
              </div>
            </>
          ) : (
            <div className="flex items-center ">
              <div className="flex text-lg font-bold text-yellow-400">
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <span key={index}>★</span>
                  ))}
              </div>
              {/* <span className="text-gray-500 ml-1">
                ({item.ratings?.count})
              </span> */}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-4">
      {products?.map((item, index) => (
        <Link key={index} href={`/all-products/${item?.slug}`}>
          {renderProductCard(item)}
        </Link>
      ))}
    </div>
  );
};

export default ProductCard;

"use client";
import ProductCards from "@/components/ProductCards";
import { useFlashSale } from "@/features/products/hooks/useProduct";
import React from "react";

const Offers = () => {
  const { data: flashSaleData, isLoading } = useFlashSale(5);

  if (isLoading) {
    return (
      <div className="xl:container px-2 xl:px-4 py-12 mx-auto">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="xl:container px-2 xl:px-4 py-12 mx-auto">
      <div className="flex items-center">
        <h1 className="text-xl md:text-4xl font-bold mb-0">Offer Products</h1>
        <span className="text-md md:text-xl ms-2 relative top-[1px]">
          ({flashSaleData?.length || 0} Products Found)
        </span>
      </div>
      <div className="mt-5">
        <ProductCards
          isWishlisted={false}
          isFlashSale={true}
          data={flashSaleData || []}
        />
      </div>
    </div>
  );
};

export default Offers;

"use client";
import { useState } from "react";
import ProductCards from "@/components/ProductCards";
import ProductFilter from "@/components/ProductFilter";
import Pagination from "@/components/Pagination";
import { useProductsBySubcategory } from "@/features/products/hooks/useProduct";
import { useSearchParams } from "next/navigation";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { filterGroups } from "@/utils/filterGroups";

interface CategoryProductsProps {
  slug: string;
}

const CategoryProducts = ({ slug }: CategoryProductsProps) => {
  const searchParams = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const ITEMS_PER_PAGE = 16;

  const { data, isLoading } = useProductsBySubcategory(slug, {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Update URL with new page number
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());
    window.history.pushState({}, "", url.toString());
  };

  return (
    <div className="xl:container mx-auto px-2 xl:px-4 py-12">
      <div className="flex items-center space-x-3">
        <p>Home</p> <MdOutlineKeyboardArrowRight />
        <p>Category</p> <MdOutlineKeyboardArrowRight />
        <p>{data?.subcategory?.name}</p>
      </div>
      <div className="mt-8">
        <div className="flex space-x-3">
          <div className="w-full">
            {isLoading ? (
              <div>Loading...</div>
            ) : data && data.products.length > 0 ? (
              <>
                <ProductCards isWishlisted={false} data={data.products} />
                {data.pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={data.pagination.totalPages}
                      onPageChange={handlePageChange}
                      totalItems={data.pagination.total}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-xl text-gray-600">
                  No products found in this category
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;

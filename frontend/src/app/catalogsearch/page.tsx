"use client";
import { useState, useEffect } from "react";
import ProductCards from "@/components/ProductCards";
import Pagination from "@/components/Pagination";
import { useSearchProducts } from "@/features/products/hooks/useProduct";
import { useSearchParams } from "next/navigation";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const { data, isLoading } = useSearchProducts(query, currentPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());
    window.history.pushState({}, "", url.toString());
  };


  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  return (
    <div className="xl:container mx-auto px-2 xl:px-4 py-12">
      <div className="flex items-center space-x-3">
        <p>Home</p> <MdOutlineKeyboardArrowRight />
        <p>Search Results for &quot;{query}&quot;</p>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <h1 className="text-4xl font-bold mb-0">Search Results</h1>
        {data && (
          <span className="text-xl ms-2">
            ({data.pagination.total} Products Found)
          </span>
        )}
      </div>
      <div className="mt-8">
        <div className="flex space-x-3">
          <div className="w-full">
            {isLoading ? (
              <div>Loading...</div>
            ) : data && data.products.length > 0 ? (
              <>
                <ProductCards isWishlisted={false} data={data.products} />
                {data.pagination.pages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={data.pagination.pages}
                      onPageChange={handlePageChange}
                      totalItems={data.pagination.total}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-xl text-gray-600">
                  No products found for &quot;{query}&quot;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

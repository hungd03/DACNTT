"use client";
import { useEffect } from "react";
import ProductCards from "@/components/ProductCards";
import PhoneFilter from "@/components/ProductFilter";
import Pagination from "@/components/Pagination";
import { useSearchParams, useRouter } from "next/navigation";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { filterGroups } from "@/utils/filterGroups";
import { ProductFilterParams } from "@/types/product";
import { useProductFilters } from "@/features/products/hooks/useProduct";

const Products = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFilters: Partial<ProductFilterParams> = {
    page: Number(searchParams.get("page")) || 1,
    limit: 16,
    storage: searchParams.get("storage") || undefined,
    ram: searchParams.get("ram") || undefined,
    "tan-so-quet": searchParams.get("tan-so-quet") || undefined,
    "tinh-nang-camera": searchParams.get("tinh-nang-camera") || undefined,
    "kieu-man-hinh": searchParams.get("kieu-man-hinh") || undefined,
    "nhu-cau-su-dung": searchParams.get("nhu-cau-su-dung") || undefined,
    "tinh-nang-dac-biet": searchParams.get("tinh-nang-dac-biet") || undefined,
    sort:
      (searchParams.get("sort") as ProductFilterParams["sort"]) || undefined,
  };

  const { products, isLoading, filters, setFilters } =
    useProductFilters(initialFilters);

  useEffect(() => {
    if (Object.keys(filters).length === 0) return;

    if (Object.keys(filters).length === 1 && filters.limit) return;

    const url = new URL(window.location.href);
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && key !== "limit") {
        params.set(key, value.toString());
      }
    });

    const search = params.toString();
    const newUrl = `${url.pathname}${search ? `?${search}` : ""}`;

    router.replace(newUrl);
  }, [filters, router]);

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  return (
    <div className="xl:container mx-auto px-2 xl:px-4 py-12">
      <div className="flex items-center space-x-3">
        <p>Home</p> <MdOutlineKeyboardArrowRight /> <p>Products</p>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <PhoneFilter
          filterGroups={filterGroups}
          currentFilters={filters}
          onFilterChange={setFilters}
          totalProducts={products?.pagination.total}
        />
      </div>

      <div className="mt-8">
        <div className="flex space-x-3">
          <div className="w-full">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <>
                <ProductCards
                  isWishlisted={false}
                  data={products?.products || []}
                />
                {products && products.pagination.pages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={products.pagination.page}
                      totalPages={products.pagination.pages}
                      onPageChange={handlePageChange}
                      totalItems={products.pagination.total}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

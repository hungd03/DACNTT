import {
  ProductDetail,
  ProductPagination,
  ProductListResponse,
  ProductVideo,
  ProductFilterParams,
} from "@/types/product";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { productApi } from "../api/product.api";
import { Category } from "@/types/category";

interface UseProductFiltersResult {
  products: ProductListResponse | null;
  isLoading: boolean;
  error: Error | null;
  filters: ProductFilterParams;
  setFilters: (filters: Partial<ProductFilterParams>) => void;
  resetFilters: () => void;
}

const defaultFilters: ProductFilterParams = {
  page: 1,
  limit: 10,
};

export const useProducts = (query: ProductPagination) => {
  const [data, setData] = useState<ProductListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const prevQuery = useRef<ProductPagination>();

  useEffect(() => {
    const isQueryChanged =
      JSON.stringify(prevQuery.current) !== JSON.stringify(query);

    if (isQueryChanged) {
      const fetchProducts = async () => {
        try {
          setIsLoading(true);
          const response = await productApi.getProducts(query);
          setData(response);
          setError(null);
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to fetch products";
          setError(new Error(errorMessage));
          toast.error(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProducts();
      prevQuery.current = query;
    }
  }, [query]);

  const refetch = async () => {
    try {
      setIsLoading(true);
      const response = await productApi.getProducts(query);
      setData(response);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch products";
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch };
};

export const useProduct = (idOrSlug: string, type: "id" | "slug" = "id") => {
  const [data, setData] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const loadingToast = toast.loading("Loading product...");
      try {
        setIsLoading(true);
        const response =
          type === "id"
            ? await productApi.getProductById(idOrSlug)
            : await productApi.getProductBySlug(idOrSlug);
        setData(response);
        setError(null);
        toast.dismiss(loadingToast);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch product";
        setError(new Error(errorMessage));
        toast.error(errorMessage, { id: loadingToast });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [idOrSlug, type]);

  const refetch = useCallback(async () => {
    const loadingToast = toast.loading("Reloading product...");
    try {
      setIsLoading(true);
      const response =
        type === "id"
          ? await productApi.getProductById(idOrSlug)
          : await productApi.getProductBySlug(idOrSlug);
      setData(response);
      setError(null);
      toast.dismiss(loadingToast);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch product";
      setError(new Error(errorMessage));
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  }, [idOrSlug, type]);

  return { data, isLoading, error, refetch };
};

export const useProductsBySubcategory = (
  slug: string,
  pagination: ProductPagination = { page: 1, limit: 16 }
) => {
  const [data, setData] = useState<{
    subcategory: Category;
    products: ProductDetail[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const prevQuery = useRef<{ slug: string; pagination: ProductPagination }>();

  useEffect(() => {
    const isQueryChanged =
      prevQuery.current?.slug !== slug ||
      JSON.stringify(prevQuery.current?.pagination) !==
        JSON.stringify(pagination);

    if (isQueryChanged) {
      const fetchProducts = async () => {
        try {
          setIsLoading(true);
          const response = await productApi.getProductsBySubcategory(
            slug,
            pagination
          );
          setData(response);
          setError(null);
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Failed to fetch products by subcategory";
          setError(new Error(errorMessage));
          toast.error(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProducts();
      prevQuery.current = { slug, pagination };
    }
  }, [slug, pagination]);

  const refetch = async () => {
    try {
      setIsLoading(true);
      const response = await productApi.getProductsBySubcategory(
        slug,
        pagination
      );
      setData(response);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch products by subcategory";
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch };
};

export const useFlashSale = (limit?: number) => {
  const [data, setData] = useState<ProductListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFlashSale = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await productApi.getFlashSale(limit);
      setData(response);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch flash sale products";
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFlashSale();
  }, [fetchFlashSale]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchFlashSale,
  };
};

export const useProductFilters = (
  initialFilters?: Partial<ProductFilterParams>
): UseProductFiltersResult => {
  const [filters, setFiltersState] = useState<ProductFilterParams>({
    ...defaultFilters,
    ...initialFilters,
  });
  const [products, setProducts] = useState<ProductListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await productApi.getFilteredProducts(filters);
      setProducts(response);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch products")
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const setFilters = useCallback((newFilters: Partial<ProductFilterParams>) => {
    setFiltersState((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
      // Reset to page 1 when filters change (except when explicitly changing page)
      page: newFilters.page ?? 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  return {
    products,
    isLoading,
    error,
    filters,
    setFilters,
    resetFilters,
  };
};

export const useSearchProducts = (query: string, page: number = 1) => {
  const [data, setData] = useState<ProductListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const prevQuery = useRef<{ query: string; page: number }>();

  useEffect(() => {
    const isQueryChanged =
      prevQuery.current?.query !== query || prevQuery.current?.page !== page;

    if (isQueryChanged && query.trim()) {
      const searchProducts = async () => {
        try {
          setIsLoading(true);
          const response = await productApi.searchProducts(query, page);
          setData(response);
          setError(null);
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to search products";
          setError(new Error(errorMessage));
          toast.error(errorMessage);
        } finally {
          setIsLoading(false);
        }
      };

      searchProducts();
      prevQuery.current = { query, page };
    }
  }, [query, page]);

  const refetch = async () => {
    if (query.trim()) {
      try {
        setIsLoading(true);
        const response = await productApi.searchProducts(query, page);
        setData(response);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to search products";
        setError(new Error(errorMessage));
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return { data, isLoading, error, refetch };
};

export const useCreateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const createProduct = async (productData: FormData) => {
    const loadingToast = toast.loading("Creating product...");
    try {
      setIsLoading(true);
      setSuccess(false);
      await productApi.createProduct(productData);
      setSuccess(true);
      setError(null);
      toast.success("Product created successfully!", { id: loadingToast });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create product";
      setError(new Error(errorMessage));
      toast.error(errorMessage, { id: loadingToast });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createProduct, isLoading, error, success };
};

export const useUpdateProduct = (productId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const updateProduct = async (productData: FormData) => {
    const loadingToast = toast.loading("Updating product...");
    try {
      setIsLoading(true);
      setSuccess(false);
      const updated = await productApi.updateProduct(productId, productData);
      setSuccess(true);
      setError(null);
      toast.success("Product updated successfully!", { id: loadingToast });
      return updated;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update product";
      setError(new Error(errorMessage));
      toast.error(errorMessage, { id: loadingToast });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProduct, isLoading, error, success };
};

export const useDeleteProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteProduct = async (id: string) => {
    const loadingToast = toast.loading("Deleting product...");
    try {
      setIsLoading(true);
      setSuccess(false);
      await productApi.deleteProduct(id);
      setSuccess(true);
      setError(null);
      toast.success("Product deleted successfully!", { id: loadingToast });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete product";
      setError(new Error(errorMessage));
      toast.error(errorMessage, { id: loadingToast });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteProduct, isLoading, error, success };
};

import { Category } from "./category";

export type ProductVariant = {
  _id: string;
  sku: string;
  color: string;
  storage: number;
  ram: number;
  price: number;
  stock: number;
  variantImage: {
    url: string;
    publicId: string;
  };
  soldCount: number;
};

export type ProductVideo = {
  _id: string;
  videoProvider: string;
  videoLink: string;
};

export type ProductDiscount = {
  type: "percentage" | "fixed";
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export type ProductSEO = {
  title?: string;
  description?: string;
  keywords?: string[];
  seoImage?: {
    url: string;
    publicId: string;
  };
};

interface BaseProduct {
  name: string;
  brand: string;
  description: string;
  basePrice: number;
  status: string;
  variants: ProductVariant[];
  videos: ProductVideo[];
  thumbnailImage?: {
    url: string;
    publicId: string;
  };
  images: Array<{
    _id: string | null | undefined;
    url: string;
    publicId: string;
  }>;
}

export interface ProductFormData extends BaseProduct {
  category: string;
  subcategory: string;
}

export interface ProductDetail extends BaseProduct {
  _id: string;
  slug: string;
  category: Category;
  subcategory: Category;
  minPrice: number;
  maxPrice: number;
  discount: ProductDiscount;
  soldCount: number;
  ratings?: {
    average: number;
    count: number;
  };
  seo?: ProductSEO;
  createdAt: string;
  updatedAt: string;
  __v: number;
  relatedProducts: ProductDetail[];
}

export type ProductListResponse = {
  products: ProductDetail[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export type ProductPagination = {
  page?: number;
  limit?: number;
};

export interface ProductFilterParams {
  storage?: string;
  ram?: string;
  "tan-so-quet"?: string;
  "tinh-nang-camera"?: string;
  "kieu-man-hinh"?: string;
  "nhu-cau-su-dung"?: string;
  "tinh-nang-dac-biet"?: string;
  sort?: "price-asc" | "price-desc" | "discount" | "newest";
  page?: number;
  limit?: number;
}

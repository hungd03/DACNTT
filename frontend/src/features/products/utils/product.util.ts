import { Product, ProductDiscount, ProductVariant } from "@/types/product";

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const formatStorage = (storage: number): string => {
  return storage >= 1024 ? `${storage / 1024}TB` : `${storage}GB`;
};

export const getVariantTitle = (variant: ProductVariant): string => {
  return `${formatStorage(variant.storage)} - ${variant.color}`;
};

export const calculateDiscountedPrice = (
  price: number,
  discount?: ProductDiscount
): number => {
  if (!discount || !discount.isActive) return price;

  const now = new Date();
  const startDate = new Date(discount.startDate);
  const endDate = new Date(discount.endDate);

  if (now < startDate || now > endDate) return price;

  if (discount.type === "percentage") {
    return price * (1 - discount.value / 100);
  } else {
    return Math.max(0, price - discount.value);
  }
};

export const sortVariantsByPrice = (
  variants: ProductVariant[]
): ProductVariant[] => {
  return [...variants].sort((a, b) => a.price - b.price);
};

export const getLowestPriceVariant = (
  variants: ProductVariant[]
): ProductVariant | null => {
  if (!variants.length) return null;
  return sortVariantsByPrice(variants)[0];
};

export const checkStockStatus = (variants: ProductVariant[]): boolean => {
  return variants.some((variant) => variant.stock > 0);
};

export const generateMetadata = (product: Product) => {
  return {
    title: product.seo?.title || product.name,
    description: product.seo?.description || product.description.slice(0, 160),
    keywords: product.seo?.keywords || [
      product.brand,
      product.name,
      "smartphone",
    ],
    openGraph: {
      images: [product.seo?.seoImage?.url || product.thumbnailImage.url],
    },
  };
};

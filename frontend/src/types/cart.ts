export interface CartItem {
  productId: string;
  sku: string;
  quantity: number;
  name?: string;
  color?: string;
  price?: number;
  variantImage?: {
    url: string;
  };
}

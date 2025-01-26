import { ProductDetail } from "./product";

export interface WishlistItem extends Partial<ProductDetail> {
  productId: string;
}

export interface WishlistResponse {
  success: boolean;
  items?: WishlistItem[];
  message?: string;
  result?: any;
}

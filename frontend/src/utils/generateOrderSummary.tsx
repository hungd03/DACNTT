import { CartItem } from "@/types/cart";


interface OrderSummary {
  subtotal: number;
  shippingCharge: number;
  shippingDiscount: number;
  discount: number;
  total: number;
}

export const generateOrderSummary = (
  items: CartItem[],
  shippingCharge = 25000,
  shippingDiscount = 0,
  discount = 0
): OrderSummary => {
  // Tính subtotal từ items
  const subtotal = items.reduce(
    (total, item) => total + item?.price * item.quantity,
    0
  );

  // Tính total sau khi trừ các discount
  const total = Math.max(
    0,
    subtotal + shippingCharge - shippingDiscount - discount
  );

  return {
    subtotal,
    shippingCharge,
    shippingDiscount,
    discount,
    total,
  };
};

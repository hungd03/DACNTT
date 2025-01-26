export interface Coupon {
  _id: string;
  code: string;
  codeType: string;
  quantity: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  minimumOrder: number;
  maximumDiscount: number;
  discount: number;
  discountType: string;
  image: string;
  isHide: boolean;
  isSelected?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CouponResponse {
  success: boolean;
  data: Coupon[];
  message?: string;
}

export interface SingleCouponResponse {
  success: boolean;
  data: Coupon;
  message?: string;
}

export interface CalculateDiscountResponse {
  success: boolean;
  data: {
    amount: number;
    couponData: Omit<
      Coupon,
      "isSelected" | "isHide" | "quantity" | "usedCount"
    >;
  };
  message?: string;
}

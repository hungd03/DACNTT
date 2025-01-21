"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Coupon } from "@/types/coupon";
import CouponItem from "./CouponItem";
import { useCalculateDiscount, useCoupons } from "@/features/coupon/useCoupon";
import toast from "react-hot-toast";

interface CouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCouponSelect: (coupon: Coupon, type: "shipping" | "shopping") => void;
  selectedShippingCoupon: Coupon | null;
  selectedShoppingCoupon: Coupon | null;
  subtotal: number; // Add subtotal for discount calculation
}

const CouponDialog: React.FC<CouponDialogProps> = ({
  open,
  onOpenChange,
  onCouponSelect,
  selectedShippingCoupon,
  selectedShoppingCoupon,
  subtotal,
}) => {
  const [couponCode, setCouponCode] = useState("");

  // Fetch coupons using the hook
  const { coupons, isLoading } = useCoupons();

  // Calculate discount hook
  const { calculate, isCalculating } = useCalculateDiscount();

  // Check if coupon is valid based on date
  const canUseCoupon = (startDate: string, endDate: string): boolean => {
    const couponStartDate = new Date(startDate);
    const today = new Date();
    return (
      today.getTime() >= couponStartDate.getTime() &&
      today.getTime() <= new Date(endDate).getTime()
    );
  };

  // Filter coupons
  const shippingCoupons = coupons.filter(
    (v) => v.codeType === "shipping" && canUseCoupon(v.startDate, v.endDate)
  );
  const shoppingCoupons = coupons.filter(
    (v) => v.codeType === "shopping" && canUseCoupon(v.startDate, v.endDate)
  );
  const notStartedCoupons = coupons.filter(
    (v) => new Date(v.startDate) > new Date()
  );

  const handleApply = async (coupon: Coupon) => {
    try {
      // Calculate discount before applying
      const result = await calculate(coupon.code, subtotal);

      // If calculation is successful, apply the coupon
      if (result.success) {
        onCouponSelect(coupon, coupon.codeType);
        toast.success("Áp dụng mã giảm giá thành công!");
      }
    } catch (error: any) {
      toast.error(error.message || "Không thể áp dụng mã giảm giá");
    }
  };

  const handleManualApply = async () => {
    if (!couponCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      const result = await calculate(couponCode, subtotal);

      if (result.success && result.data.couponData) {
        const coupon = coupons.find((c) => c.code === couponCode);
        if (coupon) {
          onCouponSelect(coupon, coupon.codeType);
          setCouponCode("");
          toast.success("Áp dụng mã giảm giá thành công!");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Mã giảm giá không hợp lệ");
    }
  };

  const CouponSection = ({
    title,
    coupons,
    type,
  }: {
    title: string;
    coupons: Coupon[];
    type: "shopping" | "shipping";
  }) =>
    coupons.length > 0 && (
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <CouponItem
              key={coupon._id}
              coupon={coupon}
              isSelected={
                type === "shipping"
                  ? selectedShippingCoupon?._id === coupon._id
                  : selectedShoppingCoupon?._id === coupon._id
              }
              onApply={() => handleApply(coupon)}
              isDisabled={false}
            />
          ))}
        </div>
      </div>
    );

  const NotStartedCouponSection = ({
    title,
    coupons,
  }: {
    title: string;
    coupons: Coupon[];
  }) =>
    coupons.length > 0 && (
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <CouponItem
              key={coupon._id}
              coupon={coupon}
              isSelected={false}
              onApply={() => {}}
              isDisabled={true}
            />
          ))}
        </div>
      </div>
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Khuyến mãi và mã giảm giá
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Mã giảm giá/phiếu mua hàng"
              className="flex-1 focus-visible:ring-transparent"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            />
            <Button
              variant="outline"
              onClick={handleManualApply}
              disabled={isCalculating}
            >
              {isCalculating ? "Đang áp dụng..." : "Áp dụng"}
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
            {isLoading ? (
              <div className="text-center py-4">Đang tải...</div>
            ) : (
              <div className="space-y-6">
                <CouponSection
                  title="Miễn phí vận chuyển"
                  coupons={shippingCoupons}
                  type="shipping"
                />

                <CouponSection
                  title="Giảm giá đơn hàng"
                  coupons={shoppingCoupons}
                  type="shopping"
                />

                {notStartedCoupons.length > 0 && (
                  <div className="pt-4 border-t">
                    <NotStartedCouponSection
                      title="Phiếu giảm giá sắp tới"
                      coupons={notStartedCoupons}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CouponDialog;

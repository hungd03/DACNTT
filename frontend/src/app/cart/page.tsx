"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { formatCurrency } from "@/utils/currencyFormatter";
import { useCart } from "@/features/cart/CartContext";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import CouponItem from "@/components/CouponItem";
import { Coupon } from "@/types/coupon";
import CouponDialog from "@/components/CouponDialog";
import LoginAlertDialog from "@/components/LoginAlertDialog";
import { useCalculateDiscount } from "@/features/coupon/useCoupon";

const ShoppingCart = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showCouponDialog, setShowCouponDialog] = useState(false);
  const [selectedShippingCoupon, setSelectedShippingCoupon] =
    useState<Coupon | null>(null);
  const [selectedShoppingCoupon, setSelectedShoppingCoupon] =
    useState<Coupon | null>(null);
  const { calculate: calculateDiscount } = useCalculateDiscount();
  const [shippingDiscount, setShippingDiscount] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Calculate total amount
  const total = items.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  const handleUpdateQuantity = async (
    productId: string,
    sku: string,
    delta: number
  ) => {
    try {
      await updateQuantity(productId, sku, delta);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (productId: string, sku: string) => {
    try {
      await removeItem(productId, sku);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      localStorage.removeItem("appliedCoupons");
      setSelectedShippingCoupon(null);
      setSelectedShoppingCoupon(null);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  useEffect(() => {
    const savedCoupons = localStorage.getItem("appliedCoupons");
    if (savedCoupons) {
      const coupons = JSON.parse(savedCoupons);
      if (coupons.shippingCoupon) {
        setSelectedShippingCoupon(coupons.shippingCoupon);
      }
      if (coupons.shoppingCoupon) {
        setSelectedShoppingCoupon(coupons.shoppingCoupon);
      }
    }
  }, []);

  // Thêm useEffect để tính toán discount khi coupon thay đổi
  const calculateShippingDiscount = async (
    coupon: Coupon,
    subtotal: number
  ) => {
    try {
      const result = await calculateDiscount(coupon.code, subtotal);
      setShippingDiscount(result.data?.amount || 0);
    } catch (error) {
      console.error("Error calculating shipping discount:", error);
      setShippingDiscount(0);
    }
  };

  const calculateCouponDiscount = async (coupon: Coupon, subtotal: number) => {
    try {
      const result = await calculateDiscount(coupon.code, subtotal);
      setCouponDiscount(result.data?.amount || 0);
    } catch (error) {
      console.error("Error calculating coupon discount:", error);
      setCouponDiscount(0);
    }
  };

  // Cập nhật handleCouponSelect để tính toán discount khi chọn coupon
  const handleCouponSelect = async (
    coupon: Coupon,
    type: "shipping" | "shopping"
  ) => {
    if (type === "shipping") {
      setSelectedShippingCoupon(coupon);
      await calculateShippingDiscount(coupon, total);
    } else {
      setSelectedShoppingCoupon(coupon);
      await calculateCouponDiscount(coupon, total);
    }

    const updatedCoupons = {
      shippingCoupon: type === "shipping" ? coupon : selectedShippingCoupon,
      shoppingCoupon: type === "shopping" ? coupon : selectedShoppingCoupon,
    };
    localStorage.setItem("appliedCoupons", JSON.stringify(updatedCoupons));
    setShowCouponDialog(false);
  };

  // Cập nhật handleRemoveCoupon để reset discount khi bỏ chọn
  const handleRemoveCoupon = (type: "shipping" | "shopping") => {
    if (type === "shipping") {
      setSelectedShippingCoupon(null);
    } else {
      setSelectedShoppingCoupon(null);
    }

    // Cập nhật localStorage khi remove
    const updatedCoupons = {
      shippingCoupon: type === "shipping" ? null : selectedShippingCoupon,
      shoppingCoupon: type === "shopping" ? null : selectedShoppingCoupon,
    };
    localStorage.setItem("appliedCoupons", JSON.stringify(updatedCoupons));
  };

  // Tính final total với useMemo
  const finalTotal = useMemo(() => {
    return total - shippingDiscount - couponDiscount;
  }, [total, shippingDiscount, couponDiscount]);

  return (
    <div className="bg-gray-50">
      <div className="bg-gray-50 min-h-screen xl:container mx-auto px-4 xl:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/cart">Cart</Link>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-blue-600 hover:text-red-600 text-sm mr-[32rem]"
          >
            Xóa tất cả
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Cart Items */}
          <div className="lg:col-span-2 rounded-md">
            <Table className="w-full">
              <TableHeader className="bg-[#3C4242]">
                <TableRow>
                  <TableHead className="font-bold text-white">
                    PRODUCT DETAILS
                  </TableHead>
                  <TableHead className="font-bold text-white">PRICE</TableHead>
                  <TableHead className="font-bold text-center text-white">
                    QUANTITY
                  </TableHead>
                  <TableHead className="p-4 font-bold text-right text-white">
                    SUBTOTAL
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {items.map((item) => (
                  <TableRow
                    key={`${item.productId}-${item.sku}`}
                    className="border-b"
                  >
                    <TableCell className="p-4">
                      <div className="flex gap-4">
                        {item.variantImage && (
                          <Image
                            src={item.variantImage.url}
                            alt={item.name || ""}
                            width={80}
                            height={80}
                            className="object-contain"
                          />
                        )}
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          {item.color && (
                            <div className="text-gray-500 text-sm mt-1">
                              Color: {item.color}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="font-medium">
                        {formatCurrency(item.price || 0)}
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex items-center border border-gray-300 justify-center rounded-md w-32 mx-auto">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.productId, item.sku, -1)
                          }
                          className={`px-2 py-1 rounded hover:bg-gray-50 ${
                            item.quantity <= 1
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          className="w-12 text-center rounded p-1"
                          readOnly
                        />
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.productId, item.sku, 1)
                          }
                          className="p-2 rounded hover:bg-gray-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </TableCell>

                    <TableCell className="p-4">
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency((item.price || 0) * item.quantity)}
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveItem(item.productId, item.sku)
                          }
                          className="text-blue-600 hover:text-red-600 text-sm mt-2"
                        >
                          Xóa
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Promotion */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-medium mb-2">Promotion</h2>
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      setShowCouponDialog(true);
                    } else {
                      setShowLoginDialog(true);
                    }
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Chọn hoặc nhập khuyến mãi
                </button>
              </div>

              {selectedShippingCoupon && (
                <div className="mt-4">
                  <CouponItem
                    coupon={selectedShippingCoupon}
                    isSelected={true}
                    onApply={() => handleRemoveCoupon("shipping")}
                    isDisabled={false}
                  />
                </div>
              )}

              {selectedShoppingCoupon && (
                <div className="mt-4">
                  <CouponItem
                    coupon={selectedShoppingCoupon}
                    isSelected={true}
                    onApply={() => handleRemoveCoupon("shopping")}
                    isDisabled={false}
                  />
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 text-amber-500 text-sm">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Mã giảm giá/Phiếu mua hàng sẽ không thể khôi phục sau khi đặt
                hàng
              </div>
            </div>

            {/* Add CouponDialog */}
            <CouponDialog
              open={showCouponDialog}
              onOpenChange={setShowCouponDialog}
              onCouponSelect={handleCouponSelect}
              selectedShippingCoupon={selectedShippingCoupon}
              selectedShoppingCoupon={selectedShoppingCoupon}
              subtotal={total}
            />

            {/* Payment Summary */}
            <div className="bg-white rounded-lg p-4">
              <h2 className="font-bold mb-4">Payment Details</h2>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                {selectedShippingCoupon && shippingDiscount > 0 && (
                  <div className="flex justify-between font-medium">
                    <span>Shipping Discount</span>
                    <span className="text-red-600">
                      -{formatCurrency(shippingDiscount)}
                    </span>
                  </div>
                )}

                {selectedShoppingCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between font-medium">
                    <span>Coupon Discount</span>
                    <span className="text-red-600">
                      -{formatCurrency(couponDiscount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between font-medium">
                  <span>Total Payment</span>
                  <span className="font-bold">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>

                <div className="text-right text-sm text-gray-500">
                  (VAT included)
                </div>
              </div>

              <button
                onClick={() => {
                  if (isLoggedIn) {
                    router.push("/checkouts");
                  } else {
                    setShowLoginDialog(true);
                  }
                }}
                className="w-full bg-red-600 text-white rounded-md py-3 mt-4 font-medium hover:bg-red-700 transition-colors"
              >
                Continue to checkout
              </button>
              <LoginAlertDialog
                open={showLoginDialog}
                onOpenChange={setShowLoginDialog}
                onLogin={() => router.push("/auth/login")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;

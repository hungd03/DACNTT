/* eslint-disable @next/next/no-img-element */
import { Coupon } from "@/types/coupon";
import { getCouponTimeDisplay } from "@/utils/couponDateUtils";
import { FC } from "react";

interface CouponItemProps {
  coupon: Coupon;
  isSelected: boolean;
  onApply: () => void;
  isDisabled: boolean;
}

const CouponItem: FC<CouponItemProps> = ({
  coupon,
  isSelected,
  onApply,
  isDisabled = false,
}) => {
  return (
    <div
      className={`border rounded-lg p-2 flex items-center justify-between 
        ${isSelected ? "border-red-500 bg-red-50" : ""}
        ${
          isDisabled
            ? "bg-gray-100 opacity-70 cursor-not-allowed border-gray-200"
            : ""
        }
      `}
    >
      <div className="flex items-center space-x-4">
        <div
          className={`w-20 h-20 rounded-lg flex items-center justify-center
          ${isDisabled ? "bg-gray-200" : "bg-red-100"}
        `}
        >
          <img
            src={`${
              coupon.codeType === "shopping" ? "/shopping.jpg" : "/shipping.jpg"
            }`}
            alt={coupon.code}
            className={`object-cover w-full h-full rounded-lg ${
              isDisabled ? "opacity-70" : ""
            }`}
          />
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <span
              className={`inline-block px-1 border rounded-lg font-bold text-[11px]
              ${
                isDisabled
                  ? "border-gray-400 text-gray-500 bg-gray-50"
                  : "border-red-400 bg-white text-red-500"
              }`}
            >
              {coupon.code}
            </span>
            <span
              className={`font-medium text-md ${
                isDisabled ? "text-gray-500" : ""
              }`}
            >
              {coupon.codeType === "shopping" &&
                coupon.discount &&
                `giảm ${coupon.discount}%`}{" "}
              Giảm tối đa {coupon.maximumDiscount.toLocaleString()}đ
            </span>
          </div>

          <div className="text-xs text-gray-500 mt-1">
            {coupon.minimumOrder > 0 &&
              `Đơn tối thiểu ${coupon.minimumOrder.toLocaleString()}đ`}
          </div>

          <div className="text-xs text-gray-500 mt-8">
            {getCouponTimeDisplay(coupon.startDate, coupon.endDate)}
          </div>
        </div>
      </div>

      <button
        onClick={onApply}
        disabled={isDisabled}
        className={`text-blue-500 hover:text-blue-600 font-medium text-sm mt-10
          ${
            isDisabled
              ? "opacity-70 cursor-not-allowed text-gray-500 hover:text-gray-500"
              : ""
          }
        `}
      >
        {isSelected ? "Bỏ chọn" : "Áp dụng"}
      </button>
    </div>
  );
};

export default CouponItem;

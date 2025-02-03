"use client";
import React from "react";
import { useFormik } from "formik";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { couponValidationSchema } from "@/features/coupon/validation";
import { useCoupons } from "@/features/coupon/useCoupon";
import { Coupon } from "@/types/coupon";
import toast from "react-hot-toast";

interface CouponFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Coupon;
  onSuccess?: () => void;
}

interface CouponFormData {
  code: string;
  codeType: string;
  discountType: string;
  discount: number;
  minimumOrder: number;
  maximumDiscount: number;
  startDate: string;
  endDate: string;
  quantity: number;
}

const AddCouponDialog: React.FC<CouponFormProps> = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}) => {
  const { createCoupon, updateCoupon, isCreating, isUpdating } = useCoupons(
    initialData?._id
  );

  const isEditing = Boolean(initialData?._id);
  const isLoading = isCreating || isUpdating;

  const formik = useFormik<CouponFormData>({
    initialValues: {
      code: initialData?.code || "",
      codeType: initialData?.codeType || "shopping",
      discountType: initialData?.discountType || "percent",
      discount: initialData?.discount || 0,
      minimumOrder: initialData?.minimumOrder || 0,
      maximumDiscount: initialData?.maximumDiscount || 0,
      startDate: initialData?.startDate
        ? new Date(initialData.startDate).toISOString().split("T")[0]
        : "",
      endDate: initialData?.endDate
        ? new Date(initialData.endDate).toISOString().split("T")[0]
        : "",
      quantity: initialData?.quantity || 0,
    },
    validationSchema: couponValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          await updateCoupon({
            id: initialData?._id,
            data: values,
          });
          toast.success("Coupon Updated Successfully");
        } else {
          await createCoupon(values);
          toast.success("Coupon Added Successfully");
        }
        onSuccess?.();
        formik.resetForm({});
        onClose();
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Coupon" : "Add New Coupon"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>Coupon Code</label>
              <Input
                id="code"
                {...formik.getFieldProps("code")}
                placeholder="Enter coupon code ..."
                onChange={(e) => {
                  formik.setFieldValue("code", e.target.value.toUpperCase());
                }}
                className={
                  formik.touched.code && formik.errors.code
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.code && formik.errors.code && (
                <div className="text-red-500 text-sm">{formik.errors.code}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label>Coupon Type</label>
              <Select
                value={formik.values.codeType}
                onValueChange={(value) =>
                  formik.setFieldValue("codeType", value)
                }
              >
                <SelectTrigger
                  className={
                    formik.touched.codeType && formik.errors.codeType
                      ? "border-red-500"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select coupon type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="shipping">Shipping</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.codeType && formik.errors.codeType && (
                <div className="text-red-500 text-sm">
                  {formik.errors.codeType}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <label>Discount Type</label>
              <Select
                value={formik.values.discountType}
                onValueChange={(value) =>
                  formik.setFieldValue("discountType", value)
                }
              >
                <SelectTrigger
                  className={
                    formik.touched.discountType && formik.errors.discountType
                      ? "border-red-500"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select coupon type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.discountType && formik.errors.discountType && (
                <div className="text-red-500 text-sm">
                  {formik.errors.discountType}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <label>Minimum Order</label>
            <Input
              id="minimumOrder"
              type="number"
              {...formik.getFieldProps("minimumOrder")}
              placeholder="Enter value..."
              className={
                formik.touched.minimumOrder && formik.errors.minimumOrder
                  ? "border-red-500"
                  : ""
              }
            />
            {formik.touched.minimumOrder && formik.errors.minimumOrder && (
              <div className="text-red-500 text-sm">
                {formik.errors.minimumOrder}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <label>Maximum Discount</label>
            <Input
              id="maximumDiscount"
              type="number"
              {...formik.getFieldProps("maximumDiscount")}
              placeholder="Enter value..."
              disabled={formik.values.discountType === "fixed"}
              className={`
                ${
                  formik.touched.maximumDiscount &&
                  formik.errors.maximumDiscount
                    ? "border-red-500"
                    : ""
                }
                ${
                  formik.values.discountType === "fixed"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }
              `}
            />
            {formik.touched.maximumDiscount &&
              formik.errors.maximumDiscount && (
                <div className="text-red-500 text-sm">
                  {formik.errors.maximumDiscount}
                </div>
              )}
            {formik.values.discountType === "fixed" && (
              <div className="text-gray-500 text-sm">
                Maximum discount is not applicable for fixed discount type
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <label>Value</label>
            <Input
              id="discount"
              type="number"
              {...formik.getFieldProps("discount")}
              placeholder="Enter value..."
              className={
                formik.touched.discount && formik.errors.discount
                  ? "border-red-500"
                  : ""
              }
            />
            {formik.touched.discount && formik.errors.discount && (
              <div className="text-red-500 text-sm">
                {formik.errors.discount}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label>Start Date</label>
              <Input
                id="startDate"
                type="date"
                {...formik.getFieldProps("startDate")}
                className={
                  formik.touched.startDate && formik.errors.startDate
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.startDate && formik.errors.startDate && (
                <div className="text-red-500 text-sm">
                  {formik.errors.startDate}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <label>End Date</label>
              <Input
                id="endDate"
                type="date"
                {...formik.getFieldProps("endDate")}
                className={
                  formik.touched.endDate && formik.errors.endDate
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.endDate && formik.errors.endDate && (
                <div className="text-red-500 text-sm">
                  {formik.errors.endDate}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <label>Quantity</label>
            <Input
              id="quantity"
              type="number"
              {...formik.getFieldProps("quantity")}
              placeholder="Enter quantity..."
              className={
                formik.touched.quantity && formik.errors.quantity
                  ? "border-red-500"
                  : ""
              }
            />
            {formik.touched.quantity && formik.errors.quantity && (
              <div className="text-red-500 text-sm">
                {formik.errors.quantity}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Coupon"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCouponDialog;

"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Search, Edit, Trash2, Check, X, PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddCouponDialog from "@/components/Dashboard/Coupon/AddCoupon";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/currencyFormatter";
import { formatToLocalDate } from "@/utils/couponDateUtils";
import { useCoupons } from "@/features/coupon/useCoupon";
import { Coupon } from "@/types/coupon";
import toast from "react-hot-toast";

const CouponManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const {
    coupons,
    isLoading,
    deleteCoupon,
    toggleHidden,
    isDeleting,
    isToggling,
  } = useCoupons();

  const handleAddCoupon = () => {
    setSelectedCoupon(null);
    setIsCouponDialogOpen(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsCouponDialogOpen(true);
  };

  const handleDialogClose = async () => {
    setIsCouponDialogOpen(false);
    setSelectedCoupon(null);
  };

  const handleDeleteCoupon = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCoupon(id);
        toast.success("Coupon Deleted Successfully");
      } catch (error) {
        console.error("Error deleting coupon:", error);
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleHidden(id);
      toast.success("Coupon Updated Successfully");
    } catch (error) {
      console.error("Error toggling coupon status:", error);
    }
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full space-y-6 p-6 min-h-screen">
      <Card className="Filters border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Coupon Management</h1>
            <Button
              onClick={handleAddCoupon}
              disabled={isLoading || isDeleting}
              className="flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add New Coupon
            </Button>
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-xl overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Image</TableHead>
                  <TableHead className="font-semibold">Coupon Code</TableHead>
                  <TableHead className="font-semibold">Discount Type</TableHead>
                  <TableHead className="font-semibold">Value</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Quantity</TableHead>
                  <TableHead className="font-semibold">Usage Count</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => (
                  <TableRow key={coupon._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <Image
                        src={`${
                          coupon.codeType === "shopping"
                            ? "/shopping.jpg"
                            : "/shipping.jpg"
                        }`}
                        alt={`${coupon.code} preview`}
                        width={70}
                        height={70}
                        objectFit="cover"
                        priority
                      />
                    </TableCell>
                    <TableCell className="font-medium">{coupon.code}</TableCell>
                    <TableCell>
                      {coupon.discountType === "percent"
                        ? "Percentage"
                        : "Fixed"}
                    </TableCell>
                    <TableCell>
                      {coupon.discountType === "percent"
                        ? `${coupon.discount}%`
                        : formatCurrency(coupon.discount)}
                    </TableCell>
                    <TableCell>
                      {formatToLocalDate(coupon.startDate)} -{" "}
                      {formatToLocalDate(coupon.endDate)}
                    </TableCell>
                    <TableCell>{coupon.quantity}</TableCell>
                    <TableCell>{coupon.usedCount}</TableCell>
                    <TableCell>
                      <Button
                        variant={
                          coupon.isHide === false ? "default" : "secondary"
                        }
                        size="sm"
                        onClick={() => handleToggleStatus(coupon._id)}
                        disabled={isToggling}
                      >
                        {coupon.isHide === false ? (
                          <Check className="w-4 h-4 mr-1" />
                        ) : (
                          <X className="w-4 h-4 mr-1" />
                        )}
                        {coupon.isHide === false ? "Active" : "Inactive"}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCoupon(coupon)}
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCoupon(coupon._id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddCouponDialog
        isOpen={isCouponDialogOpen}
        onClose={handleDialogClose}
        initialData={selectedCoupon || undefined}
      />
    </div>
  );
};

export default CouponManagement;

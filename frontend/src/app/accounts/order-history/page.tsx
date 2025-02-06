"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/user/useUser";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Loading from "@/app/loading";
import Pagination from "@/components/Pagination";
import { formatCurrency } from "@/utils/currencyFormatter";
import {
  getOrderStatusDisplay,
  getPaymentStatusDisplay,
  getStatusColor,
} from "@/utils/BadgeUtils";
import NoOrderFound from "@/components/Dashboard/Orders/NoOrderFound";
import CancelOrderDialog from "@/components/Dashboard/Orders/CancelOrderDialog";

const OrderHistory: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [showCancelOrderDialog, setShowCancelOrderDialog] = useState(false);
  const { userOrders, isLoadingOrders } = useUser(page, 10);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string>("");

  if (isLoadingOrders) {
    <Loading />;
  }

  const order = userOrders?.data;

  return (
    <div className="w-full px-4 pb-6">
      <h1 className="text-2xl font-semibold text-black mb-6">Order History</h1>
      <Table className="w-full bg-white rounded-lg ">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="">Order ID</TableHead>
            <TableHead className="!pl-[1.75rem]">Status</TableHead>
            <TableHead className="">Payment Status</TableHead>
            <TableHead className="">Amount</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order?.orders.map((item) => (
            <TableRow key={item.orderId} className="border-b">
              <TableCell className="p-4">
                <div>#{item.orderId}</div>
                <div className="text-gray-500 text-sm">
                  {format(new Date(item.orderDate), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </div>
              </TableCell>
              <TableCell className="p-4">
                <Badge
                  variant="outline"
                  className={`ml-2 ${getStatusColor(item.orderStatus)} gap-1`}
                >
                  {getOrderStatusDisplay(item.orderStatus)}
                </Badge>
              </TableCell>
              <TableCell className="p-4">
                <Badge
                  variant="outline"
                  className={`${
                    item.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-500"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {getPaymentStatusDisplay(item.paymentStatus)}
                </Badge>
              </TableCell>
              <TableCell className="p-4">
                {formatCurrency(Number(item.total))}
              </TableCell>
              <TableCell className="p-4 flex justify-center items-center">
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 hover:bg-gray-50"
                    onClick={() =>
                      router.push(`/accounts/order-history/${item._id}`)
                    }
                  >
                    <Eye className="h-4 w-4 text-blue-500" />
                  </Button>
                  {["pending", "preparing"].includes(item.orderStatus) && !item.cancelOrder && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 hover:bg-gray-50"
                      onClick={() => {
                        setSelectedOrderId(item._id);
                        setOrderStatus(item.orderStatus);
                        setShowCancelOrderDialog(true);
                      }}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {order && order?.pagination.totalPages > 1 && (
        <div className="flex mt-10 justify-center">
          <Pagination
            currentPage={page}
            totalPages={order?.pagination.totalPages}
            onPageChange={setPage}
            totalItems={order?.pagination.total}
          />
        </div>
      )}

      {/* Cancel Order Dialog */}
      <CancelOrderDialog
        open={showCancelOrderDialog}
        onOpenChange={setShowCancelOrderDialog}
        orderId={selectedOrderId}
        orderStatus={orderStatus}
      />

      {/* No orders message */}
      {order?.orders.length === 0 && <NoOrderFound />}
    </div>
  );
};

export default OrderHistory;

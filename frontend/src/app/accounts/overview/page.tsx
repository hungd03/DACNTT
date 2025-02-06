"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Loading from "@/app/loading";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/features/user/useUser";
import {
  getOrderStatusDisplay,
  getPaymentStatusDisplay,
  getStatusColor,
} from "@/utils/BadgeUtils";
import { formatCurrency } from "@/utils/currencyFormatter";

import { Check, Package, ShoppingBasket, Truck } from "lucide-react";

interface OrderStats {
  total: number;
  preparing: number;
  shipping: number;
  delivered: number;
}

const Overview: React.FC = () => {
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total: 0,
    preparing: 0,
    shipping: 0,
    delivered: 0,
  });
  const { userOrders, isLoadingOrders } = useUser(1, 1000);

  if (isLoadingOrders) {
    <Loading />;
  }

  useEffect(() => {
    if (userOrders) {
      const stats: OrderStats = {
        total: userOrders.data.pagination.total || 0,
        preparing:
          userOrders.data.orders.filter(
            (order) => order.orderStatus === "preparing"
          ).length || 0,
        shipping:
          userOrders.data.orders.filter(
            (order) => order.orderStatus === "shipping"
          ).length || 0,
        delivered:
          userOrders.data.orders.filter(
            (order) => order.orderStatus === "delivered"
          ).length || 0,
      };
      setOrderStats(stats);
    }
  }, [userOrders]);

  return (
    <main className="w-full px-4 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Overview</h1>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center border bg-white p-4 rounded-lg shadow">
            <div className="text-gray-600 text-3xl flex items-center justify-center mb-2 mt-0.25">
              <ShoppingBasket className="w-10 h-10" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-600">
              {orderStats.total}
            </p>
            <p className="text-gray-500">Total Orders</p>
          </div>
          <div className="text-center border bg-white p-4 rounded-lg shadow">
            <div className="text-yellow-500 text-3xl flex items-center justify-center mb-2">
              <Package className="w-10 h-10" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-500">
              {orderStats.preparing}
            </p>
            <p className="text-gray-500">Total Preparing</p>
          </div>
          <div className="text-center border bg-white p-4 rounded-lg shadow">
            <div className="text-blue-500 text-3xl flex items-center justify-center mb-2">
              <Truck className="w-10 h-10" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-500">
              {orderStats.shipping}
            </p>
            <p className="text-gray-500">Total Shipping</p>
          </div>
          <div className="text-center border bg-white p-4 rounded-lg shadow">
            <div className="text-green-500 text-3xl flex items-center justify-center mb-2">
              <Check className="w-10 h-10" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-500">
              {orderStats.delivered}
            </p>
            <p className="text-gray-500">Total Delivered</p>
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-black mt-6 mb-6">
        Recently Orders
      </h1>

      <Table className="w-full bg-white rounded-lg ">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="">Order ID</TableHead>
            <TableHead className="!pl-[1.75rem]">Status</TableHead>
            <TableHead className="">Payment Status</TableHead>
            <TableHead className="">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userOrders?.data?.orders.map((order) => (
            <TableRow key={order.orderId} className="border-b">
              <TableCell className="p-4">
                <div>#{order.orderId}</div>
                <div className="text-gray-500 text-sm">
                  {format(new Date(order.orderDate), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </div>
              </TableCell>
              <TableCell className="p-4">
                <Badge
                  variant="outline"
                  className={`ml-2 ${getStatusColor(order.orderStatus)} gap-1`}
                >
                  {getOrderStatusDisplay(order.orderStatus)}
                </Badge>
              </TableCell>
              <TableCell className="p-4">
                <Badge
                  variant="outline"
                  className={`${
                    order.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-500"
                      : "bg-red-100 text-red-500"
                  }`}
                >
                  {getPaymentStatusDisplay(order.paymentStatus)}
                </Badge>
              </TableCell>
              <TableCell className="p-4">
                {formatCurrency(Number(order.total))}
              </TableCell>
              <TableCell className="p-4 flex justify-center items-center"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
};

export default Overview;

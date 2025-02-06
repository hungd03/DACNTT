"use client";
import React from "react";
import Image from "next/image";
import { formatCurrency } from "@/utils/currencyFormatter";
import Loading from "@/app/loading";
import { useParams } from "next/navigation";
import OrderProgress from "@/components/Dashboard/Orders/OrderProgress";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getCancelOrderStatusDisplay } from "@/utils/BadgeUtils";
import { useOrder } from "@/features/order/useOrder";

interface OrderDetailsPageProps {
  params: {
    slug: string[];
  };
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = () => {
  const params = useParams();
  const orderId = params?.slug?.[0];

  const { data: orderData, isLoading } = useOrder(orderId as string);

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const orderDetails = orderData?.data;

  return (
    <div className="max-w-7xl ml-10 p-8 bg-white shadow-lg rounded-lg">
      {isLoading && <Loading />}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Thank You🥰</h1>
        <p className="text-gray-600">Your Order status is as follows</p>
        <p>
          Order ID:{" "}
          <span className="text-blue-600">#{orderDetails?.orderId}</span>
        </p>
      </div>

      {/* Order Progress */}
      {orderDetails?.orderStatus &&
        orderDetails.orderStatus !== "cancelled" && (
          <div className="mb-10">
            <OrderProgress currentStatus={orderDetails.orderStatus} />
          </div>
        )}

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Column 1 - Order Info & Addresses */}
        <div className="lg:w-2/5 space-y-8">
          {/* Order Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-2 text-lg font-semibold mb-4">
              <span>Order Information</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span>{orderDetails?.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span>
                  {orderDetails?.orderDate
                    ? new Date(orderDetails.orderDate).toLocaleString()
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Type:</span>
                <span>{orderDetails?.orderType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Status:</span>
                <span className="text-gray-700">
                  {orderDetails?.orderStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="text-gray-700">{orderDetails?.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span>{orderDetails?.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-2 text-lg font-semibold mb-4">
              <span>Shipping Address</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span>{orderDetails?.shippingAddress.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span>{orderDetails?.shippingAddress.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span>{orderDetails?.shippingAddress.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span className="text-right">
                  {orderDetails?.shippingAddress.street},{" "}
                  {orderDetails?.shippingAddress.ward},{" "}
                  {orderDetails?.shippingAddress.district},{" "}
                  {orderDetails?.shippingAddress.city}
                </span>
              </div>
            </div>
          </div>
          {orderDetails?.cancelOrder && (
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Order Cancellation Details
                </h3>
              </div>
              <div className="text-red-700">
                <p>
                  Lý do:{" "}
                  {getCancelOrderStatusDisplay(
                    orderDetails?.cancelOrder.reason || ""
                  ) || ""}
                </p>
                <p>Chi tiết: {orderDetails?.cancelOrder.description}</p>
                <p>
                  Ngày huỷ:{" "}
                  {orderDetails?.cancelOrder?.cancelDate
                    ? format(
                        new Date(orderDetails?.cancelOrder.cancelDate),
                        "dd/MM/yyyy HH:mm",
                        {
                          locale: vi,
                        }
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Column 2 - Order Summary */}
        <div className="lg:w-3/5">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {orderDetails?.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white rounded-lg"
                >
                  <Image
                    src={item.productImage || "https://placehold.co/50x50"}
                    alt={item.productName || ""}
                    width={70}
                    height={70}
                    className="rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-gray-600">Color: {item.color}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.price)}</p>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(orderDetails?.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Charge</span>
                <span>{formatCurrency(orderDetails?.shippingCharge || 0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Discount Subtotal</span>
                <span>
                  -{formatCurrency(orderDetails?.shippingDiscount || 0)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Coupon Discount</span>
                <span>-{formatCurrency(orderDetails?.discount || 0)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t">
                <span>Total</span>
                <span>{formatCurrency(orderDetails?.total || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

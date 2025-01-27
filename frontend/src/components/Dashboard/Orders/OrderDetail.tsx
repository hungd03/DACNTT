/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import { axiosInstance } from "@/lib/axiosInstance";
import { Address, OrderItem } from "@/types/order";
import { getStatusClass } from "@/utils/backgroundUtils";
import { formatCurrency } from "@/utils/currencyFormatter";
import React from "react";
import toast from "react-hot-toast";
import { FaClock } from "react-icons/fa";

interface OrderDetailsProps {
  _id: string;
  orderId: string;
  userId: { avatar: { url: string } };
  orderStatus: string;
  refundStatus: string;
  paymentMethod: string;
  orderType: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingDiscount: number;
  shippingCharge: number;
  total: number;
  orderDate: string;
  shippingAddress: Address;
  fetchOrderDetail: () => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  _id,
  orderId,
  userId,
  orderStatus,
  paymentMethod,
  orderType,
  items,
  subtotal,
  discount,
  shippingDiscount,
  shippingCharge,
  total,
  orderDate,
  shippingAddress,
  fetchOrderDetail,
}) => {
  const acceptOrder = async () => {
    await axiosInstance
      .put(`/orders/${_id}`, { orderStatus: "On the way" })
      .then((data) => {
        if (data?.data?.status) {
          toast.success("Order Accepted");
          fetchOrderDetail();
        }
      });
  };

  const cancelOrder = async () => {
    await axiosInstance
      .put(`/orders/${_id}`, { orderStatus: "Rejected" })
      .then((data) => {
        if (data?.data?.status) {
          toast.success("Order Cancelled");
          fetchOrderDetail();
        }
      });
  };

  const changeOrderStatus = async (e: any) => {
    await axiosInstance
      .put(`/orders/${_id}`, { orderStatus: e.target.value })
      .then((data) => {
        if (data?.data?.status) {
          toast.success("Order Updated");
          fetchOrderDetail();
        }
      });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-800">
            Order ID: #{orderId}
          </h1>
          <div className="flex items-center mt-2 space-x-2">
            <span className={getStatusClass(orderStatus)}>{orderStatus}</span>
          </div>
        </div>
        <div className="flex space-x-4">
          {orderStatus === "Pending" && (
            <button
              onClick={cancelOrder}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium shadow"
            >
              Reject
            </button>
          )}
          {orderStatus === "Pending" && (
            <button
              onClick={acceptOrder}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium shadow"
            >
              Accept
            </button>
          )}
          {orderStatus !== "Pending" && orderStatus !== "Rejected" && (
            <select
              name="orderStatus"
              onChange={changeOrderStatus}
              className="bg-white border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 focus:outline-none focus:ring-2 hover:bg-gray-50 transition duration-200 ease-in-out"
            >
              <option value="On The Way">On The Way</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          )}
        </div>
      </div>

      {/* Order Info */}
      <div className="mb-6 text-gray-600">
        <div className="flex items-center text-sm mb-1">
          <FaClock className="mr-2 text-gray-500" />
          {new Date(orderDate).toLocaleString()}
        </div>
        <div className="text-sm">Payment Method: {paymentMethod}</div>
        <div className="text-sm">Order Type: {orderType}</div>
      </div>

      {/* Order Details and Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Order Details
          </h2>
          <div className="border-t border-b divide-y">
            {items?.map((item, index) => (
              <div
                key={item.productName + index}
                className="flex items-center py-4"
              >
                <Image
                  src={item.productImage || "https://placehold.co/60x60"}
                  alt={item.productName || ""}
                  width={60}
                  height={60}
                  className="object-cover rounded-md border mr-4"
                />
                <div>
                  <div className="font-medium text-gray-800">
                    {item.productName}
                  </div>
                  <div className="text-gray-600 text-sm">
                    Color: {item.color}
                  </div>
                  <div className="text-gray-600 text-sm">
                    Quantity: {item.quantity}
                  </div>
                  <div className="font-medium text-gray-800">
                    {formatCurrency(item.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Summary</h2>
          <div className="border-t border-b py-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping Charge</span>
              <span>{formatCurrency(shippingCharge)}</span>
            </div>
            <div className="flex justify-between mb-2 ">
              <span>Shipping Discount Subtotal</span>
              <span className="text-red-500">
                - {formatCurrency(shippingDiscount || 0)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Discount</span>
              <span className="text-red-500">
                - {formatCurrency(discount || 0)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <AddressCard
          title="Shipping Address"
          avatar={userId.avatar.url}
          address={shippingAddress}
        />
      </div>
    </div>
  );
};

const AddressCard: React.FC<{
  title: string;
  avatar: string;
  address: Address;
}> = ({ title, avatar, address }) => (
  <div>
    <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="flex items-center">
      <Image
        src={avatar || "https://placehold.co/60x60"}
        alt="Profile"
        width={60}
        height={60}
        className="object-cover rounded-full border mr-4"
      />
      <div>
        <div className="font-medium text-gray-800">{address?.fullName}</div>
        <div className="text-gray-600 text-sm">{address?.email}</div>
        <div className="text-gray-600 text-sm">{address?.phone}</div>
        <div className="text-gray-600 text-sm">
          {address?.street}, {address?.ward}, {address?.district},{" "}
          {address?.city}
        </div>
      </div>
    </div>
  </div>
);

export default OrderDetails;

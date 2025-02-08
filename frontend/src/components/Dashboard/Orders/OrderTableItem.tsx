import { ChevronDown, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "../../ui/badge";
import { Order } from "@/types/order";
import { formatCurrency } from "@/utils/currencyFormatter";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { useUpdateOrderStatus } from "@/features/order/useOrder";
import toast from "react-hot-toast";
import {
  getOrderStatusDisplay,
  getPaymentMethodDisplay,
  getPaymentStatusDisplay,
  getStatusColor,
} from "@/utils/BadgeUtils";
import NoOrderFound from "./NoOrderFound";
import OrderSkeleton from "./OrderSkeleton";

interface OrderTableItemProps {
  orders: Order[];
  isLoading?: boolean;
}

const OrderTableItem = ({ orders, isLoading }: OrderTableItemProps) => {
  const [expandedProducts, setExpandedProducts] = useState<
    Record<string, boolean>
  >({});
  const { mutate: updateOrderStatus } = useUpdateOrderStatus();

  const toggleExpand = (orderId: string) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  if (isLoading) {
    return (
      <div>
        <OrderSkeleton />
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div>
        <NoOrderFound />
      </div>
    );
  }

  const handleApproveOrder = (orderId: string) => {
    updateOrderStatus(
      { id: orderId, orderStatus: "preparing" },
      {
        onSuccess: () => {
          toast.success("Đã xác nhận đơn hàng");
        },
        onError: () => {
          toast.error("Không thể xác nhận đơn hàng");
        },
      }
    );
  };

  const handleCancelOrder = (orderId: string) => {
    updateOrderStatus(
      {
        id: orderId,
        orderStatus: "cancelled",
        reason: "unconfirmed",
        description: "Người mua không xác nhận đơn hàng",
      },
      {
        onSuccess: () => {
          toast.success("Đã xác nhận đơn hàng");
        },
        onError: () => {
          toast.error("Không thể xác nhận đơn hàng");
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      {orders.map((order) => (
        <div key={order._id} className="border rounded">
          <div className="px-4 py-2 bg-gray-50 flex items-center gap-2 text-sm border-b">
            <span className="flex items-center">
              Khách hàng:{" "}
              <div className="bg-gray-200 rounded-full flex items-center justify-center">
                <Avatar className="w-6 h-6 inline-block align-middle mx-1 object-cover">
                  <AvatarImage src={order.userId?.avatar?.url} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </div>{" "}
              {order.shippingAddress.fullName}
            </span>
            <span className="text-gray-500 ml-auto">
              ID đơn hàng: #{order.orderId}
            </span>
          </div>
          <div className="grid grid-cols-7 items-stretch border-b last:border-b-0">
            <div className="flex flex-col gap-3 p-3 border-r">
              {order.items
                .slice(0, expandedProducts[order._id] ? undefined : 2)
                .map((item) => (
                  <div key={item._id} className="flex gap-3 border-b mb-2">
                    <Image
                      src={item.productImage || "https://placehold.co/50x50"}
                      alt={item.productName}
                      width={50}
                      height={50}
                      className="object-contain border mb-3 rounded"
                    />
                    <div className="text-sm">
                      <div className="text-gray-800">{item.productName}</div>
                      {item.color && (
                        <div className="text-gray-500 mt-1">
                          Màu: {item.color}
                        </div>
                      )}
                      <div className="text-gray-500 mt-1">
                        × {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              {order.items.length > 2 && (
                <button
                  onClick={() => toggleExpand(order._id)}
                  className="text-gray-600 text-sm flex items-center gap-1 hover:text-gray-800 mt-2"
                >
                  {expandedProducts[order._id] ? (
                    <>
                      Thu gọn
                      <ChevronDown className="w-4 h-4 rotate-180" />
                    </>
                  ) : (
                    <>
                      Xem thêm {order.items.length - 2} sản phẩm
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="text-sm p-3 border-r">
              {formatCurrency(order.total)}
            </div>
            <div className="text-sm p-3 border-r">
              {getPaymentMethodDisplay(order.paymentMethod)}
            </div>
            <div className="p-3 border-r">
              <Badge
                variant="outline"
                className={`ml-2 ${getStatusColor(order.orderStatus)} gap-1`}
              >
                {getOrderStatusDisplay(order.orderStatus)}
              </Badge>
              {order.cancelOrder && (
                <span className="text-sm p-3 text-gray-400 block">
                  Lý do: {order.cancelOrder?.description}
                </span>
              )}
            </div>

            <div className="text-sm p-3 border-r">
              {format(new Date(order.orderDate), "dd/MM/yyyy HH:mm", {
                locale: vi,
              })}
            </div>
            <div className="text-sm p-3 border-r">
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
            </div>
            <div className="p-3 flex justify-center items-center">
              {order.orderStatus !== "pending" ? (
                <Link
                  href={`/dashboard/orders/${order._id}`}
                  className="px-4 py-1 text-sm font-medium border rounded hover:bg-gray-50 border-gray-200 transition-colors"
                >
                  Xem đơn hàng
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApproveOrder(order._id)}
                    className="px-4 py-2 text-sm font-medium rounded-md text-gray-600  hover:bg-gray-50 border border-gray-200 transition-colors"
                  >
                    Xác nhận
                  </button>
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="px-4 py-2 text-sm font-medium rounded-md text-gray-600  hover:bg-gray-50 border border-gray-200 transition-colors"
                  >
                    Từ chối
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTableItem;

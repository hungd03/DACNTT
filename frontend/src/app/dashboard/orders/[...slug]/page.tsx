"use client";
import OrderDetails from "@/components/Dashboard/Orders/OrderDetail";
import { axiosInstance } from "@/lib/axiosInstance";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Order } from "@/types/order";
import Loading from "@/app/loading";

const Page = () => {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  const fetchOrderDetail = async () => {
    await axiosInstance.get(`/orders/${params?.slug?.[1]}`).then((data) => {
      if (data?.data?.status) {
        setOrder(data?.data?.data);
      }
    });
  };

  useEffect(() => {
    fetchOrderDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="text-gray-500 text-lg items-center gap-3 flex mb-4">
        <Link href="/dashboard">Dashboard</Link>
        <MdOutlineKeyboardArrowRight />
        <Link href="/dashboard/orders">Orders</Link>
        <MdOutlineKeyboardArrowRight />
        <span>View</span>
      </div>
      <div className="mt-4">
        <Suspense fallback={<Loading />}>
          {order && (
            <OrderDetails fetchOrderDetail={fetchOrderDetail} {...order} />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Page;

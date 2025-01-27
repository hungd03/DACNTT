"use client";
import React, { useEffect, useState } from "react";
import { FaFilter, FaFileExport, FaFileImport, FaEye } from "react-icons/fa";
import CustomTable from "@/components/Dashboard/Components/CustomTable";
import Link from "next/link";
import { getStatusClass } from "@/utils/backgroundUtils";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { formatCurrency } from "@/utils/currencyFormatter";
import { axiosInstance } from "@/lib/axiosInstance";

interface Orders {
  _id: string;
  orderId: string;
  orderType: string;
  userId: {
    fullName: string;
  };
  total: number;
  orderDate: string;
  orderStatus: string;
}

const Orders = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orders, setOrders] = useState<Orders[]>([]);
  const headers = [
    { key: "orderId", label: "Order ID" },
    { key: "orderType", label: "Order Type" },
    { key: "customer", label: "Customer" },
    { key: "amount", label: "Amount" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  const fetchOrders = async () => {
    await axiosInstance.get("/orders").then((data) => {
      if (data?.data?.status) {
        setOrders(data?.data?.data);
      }
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const data = orders.map((item) => ({
    orderId: item.orderId,
    orderType: (
      <span className={getStatusClass(item.orderType)}>{item.orderType}</span>
    ),
    customer: item.userId.fullName,
    amount: String(formatCurrency(item.total)),
    date: new Date(item.orderDate).toLocaleDateString(),
    status: (
      <span className={getStatusClass(item.orderStatus)}>
        {item.orderStatus}
      </span>
    ),
    action: (
      <div className="flex space-x-2">
        <Link
          href={`/dashboard/orders/view/${item._id}`}
          className="p-2 rounded bg-blue-100 hover:bg-blue-200"
        >
          <FaEye className="text-blue-500" />
        </Link>
      </div>
    ),
  }));

  return (
    <div className="p-8">
      <div className="text-gray-500 text-lg items-center gap-3 flex mb-4">
        <Link href="/dashboard">Dashboard</Link>
        <MdOutlineKeyboardArrowRight />
        <Link href="/dashboard/orders">View Orders</Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Orders</h2>
          <div className="flex space-x-2">
            <select
              className="border border-gray-300 rounded-md px-2 py-1"
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              value={rowsPerPage}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
            <button className="border border-gray-300 rounded-md px-4 py-1 flex items-center">
              <FaFilter className="mr-2" /> Filter
            </button>
            <button className="border border-gray-300 rounded-md px-4 py-1 flex items-center">
              <FaFileExport className="mr-2" /> Export
            </button>
            <button className="border border-gray-300 rounded-md px-4 py-1 flex items-center">
              <FaFileImport className="mr-2" /> Import
            </button>
          </div>
        </div>
        <CustomTable headers={headers} data={data} rowsPerPage={rowsPerPage} />
      </div>
    </div>
  );
};

export default Orders;

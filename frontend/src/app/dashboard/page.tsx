"use client";
import React, { useEffect, useState } from "react";
import {
  FaDollarSign,
  FaBox,
  FaUsers,
  FaClipboardList,
  FaClock,
  FaTruck,
  FaBoxOpen,
  FaTimesCircle,
  FaUndo,
  FaBan,
} from "react-icons/fa";
import StatCard from "@/components/Dashboard/Components/StatCard";
import OrderStatCard from "@/components/Dashboard/Components/OrderStatCard";
import SalesChart from "@/components/Dashboard/Components/SalesChart";
import OrdersChart from "@/components/Dashboard/Components/OrdersChart";
import CustomerStats from "@/components/Dashboard/Components/CustomerStats";
import ProductCards from "@/components/ProductCards";
import { formatCurrency } from "@/utils/currencyFormatter";
import { axiosInstance } from "@/lib/axiosInstance";
import { RiRefund2Line } from "react-icons/ri";
import DateRangePicker from "@/components/Dashboard/Components/DateRangePicker";

type DBMetrics = {
  totalEarning: { totalEarning: number }[];
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
};

type OrderStat = {
  _id: string;
  count: number;
};

type OrderStats = OrderStat[];

const Dashboard: React.FC = () => {
  const [dbMetrics, setDbMetrics] = useState<DBMetrics | null>(null);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [products, setProducts] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
  });
  const fetchDBMetrics = async (startDate: Date, endDate: Date) => {
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];
    await axiosInstance.get("/dashboard/metrics").then((response) => {
      if (response?.data?.status) {
        setDbMetrics(response?.data?.data);
      }
    });
    await axiosInstance.get("/dashboard/order-stats").then((response) => {
      if (response?.data?.status) {
        setOrderStats(response?.data?.data);
      }
    });
    await axiosInstance
      .get(
        `/dashboard/summary?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      )
      .then((response) => {
        if (response?.data?.status) {
          setSummaryData(response?.data?.data);
        }
      });
    await axiosInstance.get("/products").then((response) => {
      if (response?.data?.status) {
        setProducts(response?.data?.data);
      }
    });
  };

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setDateRange({ startDate, endDate });
  };

  useEffect(() => {
    fetchDBMetrics(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);
  return (
    <div className="p-4 max-w-[2000px] mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-red-500">
          Good Morning!
        </h1>
        <p className="text-md text-black mt-2">Admin</p>
      </div>

      {/* Overview Section */}
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={FaDollarSign}
            iconColor="text-pink-500"
            title="Total Earnings"
            value={formatCurrency(
              Number(
                dbMetrics?.totalEarning?.length
                  ? dbMetrics.totalEarning[0].totalEarning
                  : 0
              )
            )}
            bgColor="bg-pink-500"
            textColor="text-white"
          />
          <StatCard
            icon={FaBox}
            iconColor="text-red-500"
            title="Total Orders"
            value={dbMetrics?.totalOrders || 0}
            bgColor="bg-red-500"
            textColor="text-white"
          />
          <StatCard
            icon={FaUsers}
            iconColor="text-purple-500"
            title="Total Customers"
            value={dbMetrics?.totalCustomers || 0}
            bgColor="bg-purple-500"
            textColor="text-white"
          />
          <StatCard
            icon={FaClipboardList}
            iconColor="text-blue-500"
            title="Total Products"
            value={dbMetrics?.totalProducts || 0}
            bgColor="bg-blue-500"
            textColor="text-white"
          />
        </div>
      </div>

      {/* Order Statistics Section */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Order Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          <OrderStatCard
            icon={FaBox}
            iconColor="text-red-500"
            title="Total Orders"
            value={dbMetrics?.totalOrders || 0}
          />
          <OrderStatCard
            icon={FaClock}
            iconColor="text-yellow-500"
            title="Pending"
            value={
              orderStats?.find((item) => item?._id === "Pending")?.count || 0
            }
          />
          <OrderStatCard
            icon={FaTruck}
            iconColor="text-blue-500"
            title="Ongoing"
            value={
              orderStats?.find((item) => item?._id === "On the way")?.count || 0
            }
          />
          <OrderStatCard
            icon={FaBoxOpen}
            iconColor="text-green-500"
            title="Delivered"
            value={
              orderStats?.find((item) => item?._id === "Delivered")?.count || 0
            }
          />
          <OrderStatCard
            icon={FaTimesCircle}
            iconColor="text-pink-500"
            title="Canceled"
            value={
              orderStats?.find((item) => item?._id === "Cancelled")?.count || 0
            }
          />
          <OrderStatCard
            icon={FaUndo}
            iconColor="text-indigo-500"
            title="Returned"
            value={
              orderStats?.find((item) => item?._id === "Returned")?.count || 0
            }
          />
          <OrderStatCard
            icon={RiRefund2Line}
            iconColor="text-purple-500"
            title="Refunded"
            value={
              orderStats?.find((item) => item?._id === "Refunded")?.count || 0
            }
          />
          <OrderStatCard
            icon={FaBan}
            iconColor="text-red-500"
            title="Rejected"
            value={
              orderStats?.find((item) => item?._id === "Rejected")?.count || 0
            }
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Sales Summary Chart */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="font-bold text-lg">Sales Summary</h3>
              <div className="w-full sm:w-auto">
                <DateRangePicker
                  onDateRangeChange={handleDateRangeChange}
                  initialStartDate={dateRange.startDate}
                  initialEndDate={dateRange.endDate}
                />
              </div>
            </div>
            <div className="p-4">
              <SalesChart
                data={summaryData?.salesSummary}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
              />
            </div>
          </div>

          {/* Order Summary Chart */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h3 className="font-bold text-lg">Order Summary</h3>
            </div>
            <div className="p-4 min-h-[400px] flex items-center justify-center">
              <OrdersChart data={summaryData?.orderSummary} />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Stats Section */}
      <div className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Customer Stats */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h3 className="font-bold text-lg">Customer Stats</h3>
            </div>
            <div className="p-4">
              <CustomerStats data={summaryData?.customerActivity} />
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h3 className="font-bold text-lg">Top Customers</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {summaryData?.topCustomers?.map((item) => (
                  <div
                    key={item?._id}
                    className="bg-white rounded-lg shadow-sm"
                  >
                    <div className="p-3">
                      <img
                        src="https://placehold.co/100x100"
                        alt="profile image"
                        className="w-16 h-16 rounded-full mx-auto mb-2"
                      />
                      <p className="font-semibold text-sm truncate text-center">
                        {item?.fullName}
                      </p>
                    </div>
                    <div className="bg-blue-500 text-white p-2 rounded-b-lg">
                      <p className="text-center text-sm">
                        {item?.totalOrders} Orders
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="font-bold text-lg">Top Products</h3>
        </div>
        <div className="p-4">
          <ProductCards isWishlisted={false} data={products} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

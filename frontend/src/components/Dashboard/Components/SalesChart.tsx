import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { FaChartBar } from "react-icons/fa";
import { formatCurrency } from "@/utils/currencyFormatter";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart: React.FC = ({ data, startDate, endDate }) => {
  const formattedTotalSales = formatCurrency(data?.totalSales);
  const formattedAvgSales = formatCurrency(data?.avgSalesPerDay);

  // Tạo mảng các ngày trong khoảng date range
  const getDatesInRange = (start: Date, end: Date) => {
    const dates = [];
    const current = new Date(start);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // Format date cho label trục X
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  // Map ngày với dữ liệu sales
  const getDataPoint = (date: Date) => {
    const dayOfMonth = date.getDate();
    const salesData = data?.dailySales.find(
      (sale: any) => sale._id === dayOfMonth
    );
    return salesData ? salesData.total : 0;
  };

  // Lấy tất cả các ngày trong range
  const dateRange =
    startDate && endDate
      ? getDatesInRange(new Date(startDate), new Date(endDate))
      : [];

  const chartData = {
    labels: dateRange.map((date) => formatDate(date)),
    datasets: [
      {
        label: "Daily Sales",
        data: dateRange.map((date) => getDataPoint(date)),
        borderColor: "rgba(255, 87, 34, 1)",
        backgroundColor: "rgba(255, 87, 34, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: "rgba(255, 87, 34, 1)",
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        callbacks: {
          title: (context) => {
            return `Ngày ${context[0].label}`;
          },
          label: (context) => {
            return `Doanh thu: ${formatCurrency(context.raw as number)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        ticks: {
          callback: (value) => formatCurrency(value as number),
        },
      },
    },
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Total Sales */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <FaChartBar className="text-2xl text-gray-700" />
            <div>
              <p className="text-xl font-bold">{formattedTotalSales}</p>
            </div>
          </div>
          <p className="text-gray-500">Total Sales</p>
        </div>
        {/* Avg Sales Per Day */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <FaChartBar className="text-2xl text-gray-700" />
            <div>
              <p className="text-xl font-bold">{formattedAvgSales}</p>
            </div>
          </div>
          <p className="text-gray-500">Avg Sales Per Day</p>
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <Line
          style={{ width: "100%", height: "400px" }}
          data={chartData}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default SalesChart;

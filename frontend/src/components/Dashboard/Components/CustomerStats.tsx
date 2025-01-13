import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CustomerStats: React.FC = ({ data }) => {
  // Tạo mảng cố định cho labels từ 6:00 đến 23:00
  const fixedHours = Array.from({ length: 18 }, (_, i) => `${i + 6}:00`);

  // Hàm để lấy số lượng đơn hàng cho mỗi giờ
  const getCountForHour = (hour: number) => {
    const hourData = data?.find((item) => item._id === hour);
    return hourData ? hourData.count : 0;
  };

  // Tạo mảng data tương ứng với các giờ cố định
  const getHourlyData = () => {
    return fixedHours.map((hour) => {
      const hourNumber = parseInt(hour);
      return getCountForHour(hourNumber);
    });
  };

  const chartData = {
    labels: fixedHours,
    datasets: [
      {
        label: "Hourly Orders",
        data: getHourlyData(),
        backgroundColor: "#567dff",
        borderColor: "#567dff",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          boxWidth: 30,
          color: "#666",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          title: (context) => {
            return `Time: ${context[0].label}`;
          },
          label: (context) => {
            return `Orders: ${context.raw}`;
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
          color: "#666",
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
          stepSize: 1,
          precision: 0,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Hourly Orders</h2>
      <div style={{ height: "400px" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default CustomerStats;

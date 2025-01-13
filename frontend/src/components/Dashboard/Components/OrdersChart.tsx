import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const OrdersChart: React.FC = ({ data }) => {
  // Data for the chart
  const totalOrders = data?.totalOrders;
  const delivered = data?.orderStatusSummary?.Delivered;
  const canceled = data?.orderStatusSummary?.Cancelled;
  const rejected = data?.orderStatusSummary?.Rejected;

  // Doughnut chart data
  const chartData = {
    labels: ["Delivered", "Canceled", "Rejected"],
    datasets: [
      {
        label: "Delivered",
        data: [delivered, totalOrders - delivered],
        backgroundColor: ["#22C55E", "rgba(0,0,0,0.1)"],
        hoverOffset: 4,
        borderWidth: 0,
        borderColor: "#FFF",
        cutout: "60%",
      },
      {
        label: "Canceled",
        data: [canceled, totalOrders - canceled],
        backgroundColor: ["#EAB308", "rgba(0,0,0,0.1)"],
        hoverOffset: 4,
        borderWidth: 0,
        borderColor: "#FFF",
        cutout: "45%",
      },
      {
        label: "Rejected",
        data: [rejected, totalOrders - rejected],
        backgroundColor: ["#EF4444", "rgba(0,0,0,0.1)"],
        borderWidth: 0,
        borderColor: "#FFF",
        cutout: "35%",
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend for simplicity
      },
      tooltip: {
        enabled: false, // Disable tooltips
      },
    },
    cutout: "70%", // Adjust the inner radius
  };

  return (
    <div className="flex items-center space-x-8">
      <div className="relative w-200 h-200">
        <Doughnut data={chartData} options={chartOptions} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-lg font-bold">{totalOrders}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-[#22C55E] rounded-full"></span>
          <p className="text-gray-600">
            Delivered ({((delivered / totalOrders) * 100).toFixed(1)}%)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-[#EAB308] rounded-full"></span>
          <p className="text-gray-600">
            Canceled ({((canceled / totalOrders) * 100).toFixed(1)}%)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-[#EF4444] rounded-full"></span>
          <p className="text-gray-600">
            Rejected ({((rejected / totalOrders) * 100).toFixed(1)}%)
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrdersChart;

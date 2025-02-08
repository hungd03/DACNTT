import React from "react";
import { Check, Clock, Package, Truck } from "lucide-react";

const OrderProgress = ({ currentStatus = "shipping" }) => {
  const stages = [
    {
      id: "pending",
      label: "Awaiting confirmation",
      icon: Clock,
    },
    {
      id: "preparing",
      label: "Preparing order",
      icon: Package,
    },
    {
      id: "shipping",
      label: "Shipping",
      icon: Truck,
    },
    {
      id: "delivered",
      label: "Delivered",
      icon: Check,
    },
  ];

  const getStageStatus = (stageId: string) => {
    const stageIndex = stages.findIndex((stage) => stage.id === stageId);
    const currentIndex = stages.findIndex(
      (stage) => stage.id === currentStatus
    );

    if (stageIndex < currentIndex) return "completed";
    if (stageIndex === currentIndex) return "current";
    return "pending";
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="relative flex items-center justify-between">
        {/* Progress line background */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200" />

        {/* Progress line filled */}
        <div
          className="absolute top-5 left-0 h-1 bg-green-500 transition-all duration-500"
          style={{
            width: `${
              (stages.findIndex((stage) => stage.id === currentStatus) /
                (stages.length - 1)) *
              100
            }%`,
          }}
        />

        {/* Stages */}
        {stages.map((stage) => {
          const status = getStageStatus(stage.id);
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2
                ${
                  status === "completed"
                    ? "bg-green-500 text-white"
                    : status === "current"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }
                transition-colors duration-500`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span
                className={`absolute text-sm font-medium text-center w-25 mt-12 ${
                  status === "completed"
                    ? "text-green-500"
                    : status === "current"
                    ? "text-green-500"
                    : "text-gray-500"
                } transition-colors duration-500`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderProgress;

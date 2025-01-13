import React from "react";
import { IconType } from "react-icons";

interface OrderStatCardProps {
  icon: IconType;
  iconColor: string;
  title: string;
  value: string | number;
}

const OrderStatCard: React.FC<OrderStatCardProps> = ({
  icon: Icon,
  iconColor,
  title,
  value,
}) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow">
      <div className="flex items-center gap-3">
        <Icon
          className={`text-2xl p-2 w-10 h-10 rounded-full mr-2 ${iconColor}`}
        />
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatCard;

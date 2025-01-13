import React from "react";
import { IconType } from "react-icons";

interface StatCardProps {
  icon: IconType;
  iconColor: string;
  title: string;
  value: string | number;
  bgColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  iconColor,
  title,
  value,
  bgColor,
  textColor,
}) => {
  return (
    <div className={`${bgColor} ${textColor} p-3 rounded-lg`}>
      <div className="flex items-center gap-3">
        <Icon
          className={`text-2xl bg-white p-2 w-8 h-8 rounded-full mr-2 ${iconColor}`}
        />
        <div>
          <p className="text-sm">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

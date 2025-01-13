import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface DateRangePickerProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  initialStartDate: Date;
  initialEndDate: Date;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateRangeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("last7");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const ranges = {
    last7: {
      label: "Last 7 Days",
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);
        return { start, end };
      },
    },
    last30: {
      label: "Last 30 Days",
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        return { start, end };
      },
    },
    last90: {
      label: "Last 90 Days",
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 90);
        return { start, end };
      },
    },
    custom: {
      label: "Custom Date Range",
      getRange: () => ({
        start: new Date(customStartDate),
        end: new Date(customEndDate),
      }),
    },
  };

  const handleRangeSelect = (range: string) => {
    setSelectedRange(range);
    if (range !== "custom") {
      const { start, end } = ranges[range].getRange();
      onDateRangeChange(start, end);
      setIsOpen(false);
    }
  };

  const handleCustomRangeApply = () => {
    if (customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      onDateRangeChange(start, end);
      setIsOpen(false);
    }
  };

  const formatDate = (date: any) => {
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDisplayText = () => {
    if (selectedRange === "custom" && customStartDate && customEndDate) {
      return `${formatDate(new Date(customStartDate))} - ${formatDate(
        new Date(customEndDate)
      )}`;
    }
    const range = ranges[selectedRange].getRange();
    return `${formatDate(range.start)} - ${formatDate(range.end)}`;
  };

  return (
    <div className="relative w-72">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border rounded-md shadow-sm flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="text-sm text-gray-700">{getDisplayText()}</span>
        <FaChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg z-10">
          <ul className="py-1">
            {Object.entries(ranges).map(([key, { label }]) => (
              <li key={key}>
                <button
                  onClick={() => {
                    handleRangeSelect(key);
                    if (key !== "custom") setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                    selectedRange === key
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {selectedRange === "custom" && (
            <div className="p-4 border-t">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleCustomRangeApply}
                  className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Apply Range
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;

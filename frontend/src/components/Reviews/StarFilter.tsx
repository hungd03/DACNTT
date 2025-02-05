import React from "react";
import { Star } from "lucide-react";

interface StarFilterProps {
  header?: string;
  selectedStar: number | null;
  onStarSelect: (star: number | null) => void;
}

const StarFilter = ({
  selectedStar,
  onStarSelect,
  header,
}: StarFilterProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">{header}</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onStarSelect(null)}
          className={`px-4 h-[30px] rounded-md border ${
            selectedStar === null
              ? " border-red-500 text-red-500"
              : "border-gray-300 text-gray-700"
          }`}
        >
          Tất cả
        </button>
        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            onClick={() => onStarSelect(star)}
            className={`flex items-center gap-1 px-4 h-[30px] rounded-md border ${
              selectedStar === star
                ? " border-red-500 text-red-500"
                : "border-gray-300 text-gray-700"
            }`}
          >
            {star}
            <Star size={15} className="text-yellow-500 fill-yellow-500 mb-1" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarFilter;

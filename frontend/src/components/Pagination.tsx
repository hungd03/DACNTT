import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const getDisplayedPages = () => {
    let pages = [];
    const totalDisplayed = 9;
    const sidePages = Math.floor(totalDisplayed / 2);

    if (totalPages <= totalDisplayed) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      let start;
      let end;

      if (currentPage <= sidePages + 1) {
        start = 1;
        end = totalDisplayed;
      } else if (currentPage >= totalPages - sidePages) {
        start = totalPages - totalDisplayed + 1;
        end = totalPages;
      } else {
        start = currentPage - sidePages;
        end = currentPage + sidePages;
      }

      pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-end gap-4">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 bg-white border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      <div className="flex">
        {currentPage > 5 && <span className="px-2 text-gray-600">...</span>}

        <div className="flex overflow-hidden rounded-lg border border-gray-200">
          {getDisplayedPages().map((page, index) => (
            <Button
              key={page}
              variant="outline"
              className={`h-8 w-8 font-medium rounded-none border-0 border-r last:border-r-0 border-gray-200 ${
                currentPage === page
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}
        </div>

        {currentPage < totalPages - 4 && (
          <span className="px-2 text-gray-600">...</span>
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 bg-white border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;

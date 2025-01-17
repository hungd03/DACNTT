import React, { useState, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter, X, ChevronDown } from "lucide-react";
import {
  FaPercent,
  FaSortAmountDown,
  FaSortAmountDownAlt,
} from "react-icons/fa";
import { ProductFilterParams } from "@/types/product";
import { MdOutlineAccessTimeFilled } from "react-icons/md";

type FilterOption = {
  label: string;
  value: string;
};

type FilterGroup = {
  title: string;
  key: string;
  options: FilterOption[];
};

type SelectedFilters = {
  [key: string]: string[];
};

interface PhoneFilterProps {
  filterGroups: FilterGroup[];
  currentFilters: ProductFilterParams;
  onFilterChange: (filters: Partial<ProductFilterParams>) => void;
  totalProducts?: number;
}

const PhoneFilter: React.FC<PhoneFilterProps> = ({
  filterGroups,
  currentFilters,
  onFilterChange,
  totalProducts,
}) => {
  const [mainOpen, setMainOpen] = useState(false);
  const [childOpen, setChildOpen] = useState<{ [key: string]: boolean }>({});
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(
    () => {
      // Initialize from currentFilters but exclude sort and pagination params
      const initial: SelectedFilters = {};
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (
          value &&
          typeof value === "string" &&
          key !== "sort" &&
          key !== "page" &&
          key !== "limit"
        ) {
          initial[key] = value.split(",");
        }
      });
      return initial;
    }
  );
  const [appliedFilters, setAppliedFilters] =
    useState<SelectedFilters>(selectedFilters);

  const handleFilterClick = (groupKey: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentGroup = prev[groupKey] || [];
      const newGroup = currentGroup.includes(value)
        ? currentGroup.filter((v) => v !== value)
        : [...currentGroup, value];

      return {
        ...prev,
        [groupKey]: newGroup.length > 0 ? newGroup : [],
      };
    });
  };

  const handleApplyFilters = (groupKey?: string) => {
    const filtersToApply = groupKey
      ? { [groupKey]: selectedFilters[groupKey] }
      : selectedFilters;

    setAppliedFilters((prev) => ({
      ...prev,
      ...filtersToApply,
    }));

    // Convert to API format
    const apiFilters: Partial<ProductFilterParams> = {};
    Object.entries(filtersToApply).forEach(([key, values]) => {
      if (values && values.length > 0) {
        (apiFilters[key as keyof typeof apiFilters] as string) =
          values.join(",");
      }
    });

    // Cập nhật URL
    const url = new URL(window.location.href);

    // Xóa params hiện tại
    Array.from(url.searchParams.keys()).forEach((key) => {
      url.searchParams.delete(key);
    });

    // Thêm params mới
    Object.entries(apiFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });

    // Giữ lại sort nếu có
    if (currentFilters.sort) {
      url.searchParams.set("sort", currentFilters.sort);
    }

    // Cập nhật URL
    window.history.pushState({}, "", url.toString());

    if (groupKey) {
      setChildOpen((prev) => ({ ...prev, [groupKey]: false }));
    } else {
      setMainOpen(false);
    }

    // Gọi API với filters mới
    onFilterChange({
      ...apiFilters,
      page: 1,
      sort: currentFilters.sort,
      limit: currentFilters.limit,
    });
  };

  const handleRemoveFilterGroup = (groupKey: string) => {
    // Cập nhật state local
    const newFilters = { ...selectedFilters };
    delete newFilters[groupKey];

    setSelectedFilters(newFilters);
    setAppliedFilters(newFilters);

    // Nếu không còn filter nào, redirect về trang gốc
    if (Object.keys(newFilters).length === 0) {
      window.location.href = "/all-products";
      return;
    }

    // Tạo URL mới chỉ với những filter còn lại
    const url = new URL(window.location.href);

    // Xóa tất cả params hiện tại
    Array.from(url.searchParams.keys()).forEach((key) => {
      url.searchParams.delete(key);
    });

    // Thêm lại các filter còn lại
    Object.entries(newFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        url.searchParams.set(key, values.join(","));
      }
    });

    // Giữ lại sort nếu có
    if (currentFilters.sort) {
      url.searchParams.set("sort", currentFilters.sort);
    }

    // Cập nhật URL
    window.location.href = url.toString();
  };

  const handleClearAll = () => {
    setSelectedFilters({});
    setAppliedFilters({});
    window.location.href = "/all-products";
  };

  const handleSortChange = (
    sort: "price-asc" | "price-desc" | "discount" | "newest"
  ) => {
    onFilterChange({ sort, page: 1 });
  };

  const totalSelectedFilters = useMemo(
    () =>
      Object.values(selectedFilters).reduce(
        (acc, curr) => acc + (curr?.length || 0),
        0
      ),
    [selectedFilters]
  );

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <h2 className="text-xl font-semibold">Filter Products</h2>
      <div className="flex flex-wrap gap-2">
        {/* Main Filter Button */}
        <Popover open={mainOpen} onOpenChange={setMainOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filter
              {totalSelectedFilters > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-primary rounded-lg">
                  {totalSelectedFilters}
                </span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[770px] p-0" align="start">
            <div className="max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-3 gap-x-6 gap-y-3 p-2">
                {filterGroups.map((group) => (
                  <div key={group.key} className="space-y-1">
                    <h3 className="text-lg font-semibold">{group.title}</h3>
                    <ul className="flex flex-wrap -m-1">
                      {group.options.map((option) => (
                        <li key={option.value} className="m-1">
                          <button
                            onClick={() =>
                              handleFilterClick(group.key, option.value)
                            }
                            className={`px-2 py-2 text-sm rounded-lg border transition-colors
                              ${
                                selectedFilters[group.key]?.includes(
                                  option.value
                                )
                                  ? "bg-red-50 text-red-500 border-red-600"
                                  : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                              }`}
                          >
                            {option.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {totalSelectedFilters > 0 && (
              <div className="sticky bottom-0 left-0 right-0 grid grid-cols-2 gap-3 p-4">
                <Button
                  variant="outline"
                  className="w-full bg-gray-50"
                  onClick={() => setMainOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="w-full bg-red-500 hover:bg-red-600"
                  onClick={() => handleApplyFilters()}
                >
                  Apply
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Child Filter Buttons */}
        {filterGroups.map((group) => (
          <Popover
            key={group.key}
            open={childOpen[group.key]}
            onOpenChange={(open) =>
              setChildOpen((prev) => ({ ...prev, [group.key]: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`flex items-center gap-2 ${
                  appliedFilters[group.key]?.length
                    ? "bg-red-50 text-red-500 border-red-500"
                    : "bg-gray-50"
                }`}
              >
                {group.title}
                <ChevronDown className="w-4 h-4" />
                {appliedFilters[group.key]?.length > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-lg">
                    {appliedFilters[group.key].length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[300px] p-4" align="start">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterClick(group.key, option.value)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        selectedFilters[group.key]?.includes(option.value)
                          ? "bg-red-50 text-red-500 border-red-500"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedFilters[group.key]?.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      setChildOpen((prev) => ({ ...prev, [group.key]: false }))
                    }
                  >
                    Close
                  </Button>
                  <Button
                    className="w-full bg-red-500 hover:bg-red-600"
                    onClick={() => handleApplyFilters(group.key)}
                  >
                    Apply
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        ))}
      </div>

      {/* Applied Filters Display */}
      {Object.keys(appliedFilters).some(
        (key) => appliedFilters[key]?.length > 0
      ) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Filtering By</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(appliedFilters).map(([groupKey, values]) => {
              if (!values?.length) return null;
              const group = filterGroups.find((g) => g.key === groupKey);
              const labels = values
                .map(
                  (value) =>
                    group?.options.find((opt) => opt.value === value)?.label
                )
                .filter(Boolean);

              return (
                <div
                  key={groupKey}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg border border-red-600"
                >
                  <button
                    onClick={() => handleRemoveFilterGroup(groupKey)}
                    className="hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="text-sm">
                    {group?.title}: {labels.join(" | ")}
                  </span>
                </div>
              );
            })}
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg border border-red-600"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Sort Section */}
      <div className="space-y-4">
        <span className="text-xl font-semibold">Sort By</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`${
              currentFilters.sort === "price-desc"
                ? "bg-red-50 text-red-500 border-red-500"
                : "bg-gray-50"
            }`}
            onClick={() => handleSortChange("price-desc")}
          >
            <FaSortAmountDown className="w-4 h-4" />
            Giá Cao - Thấp
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`${
              currentFilters.sort === "price-asc"
                ? "bg-red-50 text-red-500 border-red-500"
                : "bg-gray-50"
            }`}
            onClick={() => handleSortChange("price-asc")}
          >
            <FaSortAmountDownAlt className="w-4 h-4" />
            Giá Thấp - Cao
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`${
              currentFilters.sort === "discount"
                ? "bg-red-50 text-red-500 border-red-500"
                : "bg-gray-50"
            }`}
            onClick={() => handleSortChange("discount")}
          >
            <FaPercent className="w-3 h-3" />
            Khuyến Mãi Hot
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`${
              currentFilters.sort === "newest" || !currentFilters.sort
                ? "bg-red-50 text-red-500 border-red-500"
                : "bg-gray-50"
            }`}
            onClick={() => handleSortChange("newest")}
          >
            <MdOutlineAccessTimeFilled className="w-3 h-3" />
            Mới nhất
          </Button>
        </div>
      </div>
      {totalProducts === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">
            No products found matching the selected filter
          </p>
        </div>
      )}
    </div>
  );
};

export default PhoneFilter;

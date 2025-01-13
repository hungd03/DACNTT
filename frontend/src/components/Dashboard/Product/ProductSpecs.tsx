import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface Specification {
  name: string;
  key?: string;
  values: string[];
}

interface ProductSpecsProps {
  specifications: Specification[];
  onChange: (specs: Specification[]) => void;
  filterGroups?: {
    title: string;
    key: string;
    options: { label: string; value: string }[];
  }[];
}

const ProductSpecs: React.FC<ProductSpecsProps> = ({
  specifications = [],
  onChange,
  filterGroups = [],
}) => {
  const handleOptionSelect = (
    groupKey: string,
    option: { label: string; value: string }
  ) => {
    let newSpecs = [...specifications];

    // Find if there's any spec with the same key
    const existingSpecIndex = newSpecs.findIndex(
      (spec) => spec.key === groupKey
    );

    if (existingSpecIndex >= 0) {
      const valueExists = newSpecs[existingSpecIndex].values.includes(
        option.label
      );

      if (!valueExists) {
        // Add new value to existing spec
        newSpecs[existingSpecIndex] = {
          ...newSpecs[existingSpecIndex],
          values: [...newSpecs[existingSpecIndex].values, option.label],
        };
      } else {
        // Remove the value if it exists
        newSpecs[existingSpecIndex] = {
          ...newSpecs[existingSpecIndex],
          values: newSpecs[existingSpecIndex].values.filter(
            (value) => value !== option.label
          ),
        };

        // Remove the entire spec if no values left
        if (newSpecs[existingSpecIndex].values.length === 0) {
          newSpecs = newSpecs.filter((_, index) => index !== existingSpecIndex);
        }
      }
    } else {
      // Add new specification group
      const group = filterGroups.find((g) => g.key === groupKey);
      if (group) {
        // Check if there's already a spec with the same name but different key
        const existingSpecWithSameName = newSpecs.find(
          (spec) => spec.name === group.title
        );

        if (!existingSpecWithSameName) {
          newSpecs.push({
            name: group.title,
            key: groupKey,
            values: [option.label],
          });
        }
      }
    }

    onChange(newSpecs);
  };

  const isOptionSelected = (groupKey: string, optionLabel: string) => {
    const spec = specifications.find((spec) => spec.key === groupKey);
    return spec?.values.includes(optionLabel) || false;
  };

  const totalSelectedSpecs = specifications.reduce(
    (acc, curr) => acc + curr.values.length,
    0
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2 bg-gray-50"
        >
          <Filter className="w-4 h-4" />
          Product Specifications
          {totalSelectedSpecs > 0 && (
            <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-primary rounded-full">
              {totalSelectedSpecs}
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
                  {group.options.map((option) => {
                    const isSelected = isOptionSelected(
                      group.key,
                      option.label
                    );
                    return (
                      <li key={option.value} className="m-1">
                        <button
                          type="button"
                          onClick={() => handleOptionSelect(group.key, option)}
                          className={`px-2 py-2 text-sm rounded-lg border transition-colors
                            ${
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                            }`}
                        >
                          {option.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProductSpecs;

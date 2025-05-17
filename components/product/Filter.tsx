import React from "react";
import FilterItem from "@/components/product/FilterItem";

// Reuse the ProductFilter interface in this component.
// If you’d like to share the same type definition across components,
// consider moving it to a types file.
interface ProductFilter {
  name: string;
  displayName: string;
  component: string;
  data: any[];
}

interface FilterProps {
  filters: ProductFilter[];
  onFilterChange: (name: string, id: string, isChecked: boolean) => void;
}

const Filter: React.FC<FilterProps> = ({ filters, onFilterChange }) => {
  return (
    <div>
      <h2 className="text-[var(--dark-main)] text-xl mb-4">Filter</h2>
      <div className="flex flex-col gap-4">
        {filters.map((filter, index) => (
          <FilterItem
            key={index}
            filter={filter}
            onFilterChange={onFilterChange}
          />
        ))}
      </div>
    </div>
  );
};

export default Filter;

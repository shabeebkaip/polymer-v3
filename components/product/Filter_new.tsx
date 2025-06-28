import React from "react";
import FilterItem from "@/components/product/FilterItem";

// Updated interface to match the API response structure
interface FilterDataItem {
  _id: string | boolean;
  name: string;
  count: number;
}

interface FilterSection {
  name: string;
  displayName: string;
  component: string;
  filterType: string;
  collapsible: boolean;
  searchable?: boolean;
  data: FilterDataItem[];
}

interface FilterProps {
  filters: FilterSection[];
  query: Record<string, any>;
  onFilterChange: (name: string, id: string, isChecked: boolean) => void;
  loader?: boolean;
}

const Filter: React.FC<FilterProps> = ({ filters, onFilterChange, query }) => {
  return (
    <div>
      <h2 className="text-[var(--dark-main)] text-xl mb-4">Filter</h2>
      <div className="flex flex-col gap-4">
        {filters?.map((filter, index) => (
          <FilterItem
            key={index}
            filter={filter}
            query={query}
            onFilterChange={onFilterChange}
          />
        ))}
      </div>
    </div>
  );
};

export default Filter;

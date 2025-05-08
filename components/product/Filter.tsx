import React from "react";
import FilterItem from "@/components/product/FilterItem";

interface Option {
  name: string;
  value: string;
}

interface FilterItemType {
  name: string;
  filter_key: string;
  searchable?: boolean;
  options: Option[];
}

interface FilterProps {
  filters: FilterItemType[];
  onFilterChange: (selectedOption: string) => void;
}

const Filter: React.FC<FilterProps> = ({ filters, onFilterChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(event.target.value);
  };

  return (
    <div>
      <h2 className="text-[var(--dark-main)] text-xl mb-4">Filter</h2>
      <div className="flex flex-col gap-4">
        {filters?.map((filter, index) => (
          <FilterItem key={index} filter={filter} />
        ))}
      </div>
    </div>
  );
};

export default Filter;

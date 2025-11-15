import React from "react";
import FilterItem from "@/components/product/FilterItem";
import { FilterProps } from "@/types/product";

const Filter: React.FC<FilterProps> = ({ filters, onFilterChange, query }) => {
  return (
    <div className="space-y-6">
      {filters?.map((filter, index) => (
        <div key={index} className="relative">
          <FilterItem
            filter={filter}
            query={query}
            onFilterChange={onFilterChange}
          />
        </div>
      ))}
      
      {filters?.length === 0 && (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <p className="text-gray-500 text-sm">No filters available</p>
        </div>
      )}
    </div>
  );
};

export default Filter;

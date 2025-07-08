"use client";

import React, { useState } from "react";

interface Data {
  name: string;
  _id: string | boolean;
  count?: number;
}

interface FilterItemProps {
  filter: {
    name: string;
    displayName: string;
    component?: string;
    filterType?: string;
    collapsible?: boolean;
    searchable?: boolean;
    data: Data[];
  };
  query: Record<string, unknown>;
  onFilterChange: (name: string, id: string, isChecked: boolean) => void;
}

const FilterItem: React.FC<FilterItemProps> = ({
  filter,
  onFilterChange,
  query,
}) => {
  const [open, setOpen] = useState(true);

  const getSelectedCount = () => {
    const selectedValues = query[filter.name] || [];
    return Array.isArray(selectedValues) ? selectedValues.length : 0;
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <h4 className="font-semibold text-gray-900">{filter?.displayName}</h4>
          {getSelectedCount() > 0 && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
              {getSelectedCount()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {getSelectedCount() > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const selectedValues = query[filter.name] || [];
                selectedValues.forEach((value: string) => {
                  onFilterChange(filter.name, value, false);
                });
              }}
              className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition-colors duration-200"
            >
              Clear
            </button>
          )}
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filter?.data?.map((option: Data, index: number) => {
              const id =
                typeof option === "object"
                  ? String(option._id || option.name)
                  : String(option);
              const label =
                typeof option === "object" ? option.name : String(option);
              const count = typeof option === "object" ? option.count : 0;

              return (
                <label
                  key={index}
                  htmlFor={`${filter.name}-${id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150 group"
                >
                  <input
                    type="checkbox"
                    id={`${filter.name}-${id}`}
                    name={label}
                    value={id}
                    checked={query[filter.name]?.includes(id) || false}
                    onChange={(e) =>
                      onFilterChange(filter.name, id, e.target.checked)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-2 transition-colors duration-200"
                  />
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-150 truncate">
                      {label || (
                        <span className="italic text-gray-400">Unnamed</span>
                      )}
                    </span>
                    {count !== undefined && (
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        ({count})
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
          
          {(!filter?.data || filter.data.length === 0) && (
            <div className="text-center py-6">
              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500 text-sm">No options available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterItem;

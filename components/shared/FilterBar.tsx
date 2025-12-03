import React from 'react';
import { Search, Filter, XCircle } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface ActiveFilter {
  type: 'search' | 'status';
  label: string;
  value: string;
  onRemove: () => void;
}

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  statusOptions: FilterOption[];
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
  activeFilters: ActiveFilter[];
  isSearching?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  statusOptions,
  onStatusChange,
  onClearFilters,
  activeFilters,
  isSearching = false
}) => {
  const hasActiveFilters = searchTerm || statusFilter !== "all";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name, company, or grade..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="lg:w-56">
          <div className="relative">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors appearance-none cursor-pointer"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Clear
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
          <span className="text-xs font-medium text-gray-600">Filters:</span>
          <div className="flex items-center gap-2 flex-wrap">
            {activeFilters.map((filter, index) => (
              <span 
                key={index}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border ${
                  filter.type === 'search' 
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}
              >
                {filter.type === 'search' ? <Search className="w-3 h-3" /> : <Filter className="w-3 h-3" />}
                <span>{filter.label}</span>
                <button
                  onClick={filter.onRemove}
                  className={`ml-1 rounded-full p-0.5 transition-colors ${
                    filter.type === 'search'
                      ? 'hover:bg-green-100'
                      : 'hover:bg-blue-100'
                  }`}
                >
                  <XCircle className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

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

interface FilterTopProps {
  filters: FilterSection[];
  query: Record<string, unknown>;
  onFilterChange: (name: string, id: string, isChecked: boolean) => void;
}

const FilterTop: React.FC<FilterTopProps> = ({ filters, onFilterChange, query }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDropdown = (filterName: string) => {
    if (openDropdown === filterName) {
      setOpenDropdown(null);
    } else {
      // Calculate position for the dropdown
      const button = buttonRefs.current[filterName];
      if (button) {
        const rect = button.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX
        });
      }
      setOpenDropdown(filterName);
    }
  };

  const getSelectedCount = (filter: FilterSection) => {
    const selectedValues = query[filter.name] || [];
    return Array.isArray(selectedValues) ? selectedValues.length : 0;
  };

  const handleOptionChange = (filterName: string, optionId: string | boolean, isChecked: boolean) => {
    onFilterChange(filterName, String(optionId), isChecked);
    // Close dropdown after selection for better UX
    setOpenDropdown(null);
  };

  const isOptionSelected = (filter: FilterSection, optionId: string | boolean) => {
    const selectedValues = query[filter.name] || [];
    return Array.isArray(selectedValues) ? (selectedValues as string[]).includes(String(optionId)) : false;
  };

  const getFilteredData = (filter: FilterSection) => {
    const searchTerm = searchTerms[filter.name]?.toLowerCase() || '';
    if (!searchTerm) return filter.data;
    
    return filter.data.filter(option => 
      option.name.toLowerCase().includes(searchTerm)
    );
  };

  const handleSearchChange = (filterName: string, value: string) => {
    setSearchTerms(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Handle escape key to close dropdown
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [openDropdown]);

  return (
    <div className="flex flex-wrap gap-3 mb-2 relative">
      {filters?.map((filter) => (
        <div key={filter.name} className="relative">
          {/* Dropdown Button */}
          <button
            ref={(el) => {
              buttonRefs.current[filter.name] = el;
            }}
            type="button"
            onClick={() => toggleDropdown(filter.name)}
            className={`group flex items-center gap-2 px-4 py-3 border rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 text-sm min-w-[140px] shadow-sm hover:shadow-md transform hover:scale-[1.02] ${
              getSelectedCount(filter) > 0
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-emerald-100"
                : "border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            <span className="font-medium truncate flex-1 text-left">{filter.displayName}</span>
            <div className="flex items-center gap-2">
              {getSelectedCount(filter) > 0 && (
                <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center flex-shrink-0 font-semibold">
                  {getSelectedCount(filter)}
                </span>
              )}
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                  openDropdown === filter.name ? "rotate-180" : ""
                } ${getSelectedCount(filter) > 0 ? "text-emerald-600" : "text-gray-400"}`} 
              />
            </div>
          </button>

          {/* Dropdown Content */}
          {openDropdown === filter.name && mounted && createPortal(
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-[999999]" 
                onClick={() => setOpenDropdown(null)}
              />
              
              {/* Dropdown Menu */}
              <div 
                className="fixed w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999999] max-h-80 overflow-hidden"
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left
                }}>
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-emerald-50/30">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    {filter.displayName}
                  </span>
                  {getSelectedCount(filter) > 0 && (
                    <button
                      onClick={() => {
                        const selectedValues = query[filter.name];
                        if (Array.isArray(selectedValues)) {
                          selectedValues.forEach((value: string) => {
                            onFilterChange(filter.name, value, false);
                          });
                        }
                        // Close dropdown after clearing all for better UX
                        setOpenDropdown(null);
                      }}
                      className="text-xs text-red-600 hover:text-red-800 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors duration-200 font-medium border border-red-200 hover:border-red-300"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-2">
                {/* Search Box for searchable filters */}
                {filter.searchable && (
                  <div className="mb-3 p-2">
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder={`Search ${filter.displayName.toLowerCase()}...`}
                        value={searchTerms[filter.name] || ''}
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                        onChange={(e) => handleSearchChange(filter.name, e.target.value)}
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {getFilteredData(filter)?.map((option, index) => {
                    const optionId = option._id;
                    const isSelected = isOptionSelected(filter, optionId);
                    
                    return (
                      <label
                        key={index}
                        className={`flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-150 group ${
                          isSelected ? 'bg-emerald-50 border border-emerald-200' : 'hover:border hover:border-gray-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleOptionChange(filter.name, optionId, e.target.checked)}
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 transition-colors duration-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm truncate transition-colors duration-150 ${
                              isSelected ? 'text-emerald-700 font-medium' : 'text-gray-900 group-hover:text-gray-700'
                            }`}>
                              {option.name}
                            </span>
                            <span className={`text-xs ml-3 flex-shrink-0 px-2 py-1 rounded-full font-medium ${
                              isSelected ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {option.count}
                            </span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                
                {getFilteredData(filter)?.length === 0 && (
                  <div className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">
                      {searchTerms[filter.name] ? 'No matching options found' : 'No options available'}
                    </p>
                    {searchTerms[filter.name] && (
                      <button
                        onClick={() => handleSearchChange(filter.name, '')}
                        className="text-xs text-emerald-600 hover:text-emerald-800 mt-2 font-medium"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            </>,
            document.body
          )}
        </div>
      ))}
      
      {/* Clear All Filters Button */}
      {filters?.some(filter => getSelectedCount(filter) > 0) && (
        <button
          type="button"
          onClick={() => {
            filters.forEach(filter => {
              const selectedValues = query[filter.name];
              if (Array.isArray(selectedValues)) {
                selectedValues.forEach((value: string) => {
                  onFilterChange(filter.name, value, false);
                });
              }
            });
          }}
          className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-300 rounded-xl transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md transform hover:scale-[1.02] bg-red-50/50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear All
        </button>
      )}
    </div>
  );
};

export default FilterTop;

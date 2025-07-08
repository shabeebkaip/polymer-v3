"use client";
import React from "react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  query: Record<string, string[]>;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, query }) => {
  
  return (
    <div className="relative w-full group">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        <svg className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <input
        type="text"
        placeholder="Search products, chemicals, polymers..."
        className="w-full pl-12 pr-16 py-4 rounded-xl border border-gray-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-gray-400 placeholder-gray-500 text-gray-900 shadow-sm hover:shadow-md focus:shadow-lg"
        value={query?.search || ""}
        onChange={(e) => onSearch?.(e.target.value)}
      />
      
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex justify-center items-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
          <svg className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

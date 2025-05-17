"use client";
import { on } from "events";
import Image from "next/image";
import React, { useState } from "react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  query: Record<string, any>;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, query }) => {
  
  return (
    <div className="relative">
      <div className="w-10 h-10 bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] rounded-full flex justify-center items-center absolute top-2 right-2">
        <Image
          src="/icons/search.svg"
          alt="Arrow Icon"
          width={20}
          height={20}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-4 rounded-full border-1 border-[var(--green-light)]"
          value={query?.search || ""}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;

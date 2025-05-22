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
    <div className="relative w-full">
      <div className="md:w-10 md:h-10 w-7 h-7 bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] rounded-full flex justify-center items-center absolute top-2 right-2">
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
          className="w-full px-4 md:py-4 py-[8px] rounded-full border-1 border-[var(--green-light)]"
          value={query?.search || ""}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;

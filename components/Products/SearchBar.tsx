"use client";
import Image from "next/image";
import React, { useState } from "react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  //   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setQuery(event.target.value);
  //   };

  //   const handleSearch = () => {
  //     onSearch(query);
  //   };

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
          //   value={query}
          //   onChange={handleSearch}
        />
      </div>
    </div>
  );
};

export default SearchBar;

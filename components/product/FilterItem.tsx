"use client";
import Image from "next/image";
import React, { useState } from "react";

interface Option {
  name: string;
  value: string;
}

interface FilterItemProps {
  filter: {
    name: string;
    filter_key: string;
    searchable?: boolean;
    options: Option[];
  };
}

const FilterItem: React.FC<FilterItemProps> = ({ filter }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-[#c4c4c4] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <h4 className="font-medium text-base">{filter.name}</h4>
        <Image
          src={"/icons/up-arrow.svg"}
          alt="arrow"
          width={15}
          height={15}
          className={`transition-transform duration-300 cursor-pointer ${
            open ? "rotate-180" : "rotate-0"
          }`}
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* Content with animation */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2 px-3 pb-3">
          {/* Optional Search */}
          {filter.searchable && (
            <input
              type="text"
              placeholder="Search..."
              className="border border-[#E8E8E8] rounded-xl p-2 text-sm outline-none w-full"
            />
          )}

          {/* Checkbox options */}
          <div className="flex flex-col gap-2 pt-2">
            {filter.options.map((option, index) => (
              <label
                key={index}
                htmlFor={option.value}
                className="flex items-center gap-2 text-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  id={option.value}
                  name={option.name}
                  value={option.value}
                  className="w-5 h-5 rounded border-gray-300 accent-[var(--green-light)]"
                />
                {option.name}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterItem;

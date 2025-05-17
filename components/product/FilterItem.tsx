"use client";

import Image from "next/image";
import React, { useState } from "react";

interface Data {
  name: string;
  _id: string;
}

interface FilterItemProps {
  filter: {
    name: string;
    displayName: string;
    data: Data[];
  };
  query: Record<string, any>;
  onFilterChange: (name: string, id: string, isChecked: boolean) => void;
}

const FilterItem: React.FC<FilterItemProps> = ({
  filter,
  onFilterChange,
  query,
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-[#c4c4c4] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <h4 className="font-medium text-base">{filter?.displayName}</h4>
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

      {/* Content */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2 px-3 pb-3">
          <div className="flex flex-col gap-2 pt-2">
            {filter?.data?.map((option: any, index: number) => {
              const id =
                typeof option === "object"
                  ? option._id || option.name
                  : String(option);
              const label =
                typeof option === "object" ? option.name : String(option);

              return (
                <label
                  key={index}
                  htmlFor={id}
                  className="flex items-center gap-2 text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id={id}
                    name={label}
                    value={id}
                    checked={query[filter.name]?.includes(id) || false}
                    onChange={(e) =>
                      onFilterChange(filter.name, id, e.target.checked)
                    }
                    className="w-5 h-5 rounded border-gray-300 accent-[var(--green-light)]"
                  />
                  {label || (
                    <span className="italic text-gray-400">Unnamed</span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterItem;

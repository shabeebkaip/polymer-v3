import { TabProps } from "@/types/home";
import Image from "next/image";
import React from "react";



const Tab: React.FC<TabProps> = ({
  name,
  isSelected,
  icon,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition focus:outline-none focus:ring-2 focus:ring-green-300 duration-200 group shadow-sm hover:shadow-md min-w-0 flex-1 sm:flex-initial ${
        isSelected
          ? "bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white"
          : "border-2 border-[var(--green-main)] text-[var(--green-main)] hover:bg-green-50"
      }`}
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <div className="flex-shrink-0 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
        <Image
          src={icon}
          alt="Icon"
          width={32}
          height={32}
          className="rounded-full object-cover w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
        />
      </div>
      <span className="text-xs sm:text-sm md:text-base font-medium truncate">{name}</span>
    </button>
  );
};

export default Tab;

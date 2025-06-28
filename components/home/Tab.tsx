import Image from "next/image";
import React from "react";

interface TabProps {
  name: string;
  isSelected: boolean;
  onClick: () => void;
  icon: string;
  iconWidth?: string;
  fontSize?: string;
}

const Tab: React.FC<TabProps> = ({
  name,
  isSelected,
  icon,
  onClick,
  fontSize,
  iconWidth = "w-10",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-green-300 duration-200 group shadow-sm hover:shadow-md ${
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
          width={64}
          height={64}
          className={`rounded-full object-cover ${iconWidth}`}
        />
      </div>
      <span className={`${fontSize}`}>{name}</span>
    </button>
  );
};

export default Tab;

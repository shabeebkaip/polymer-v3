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
      onClick={() => onClick()}
      className={`flex items-center gap-4 px-2 py-1  rounded-full transition focus:outline-none ${
        isSelected
          ? "bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white"
          : " border-2 border-[var(--green-main)] text-[var(--green-main)] hover:bg-green-50"
      }`}
    >
      <div className="flex-shrink-0  rounded-full flex items-center justify-center">
        <Image
          src={icon}
          alt={"Icon"}
          width={64}
          height={64}
          className={`rounded-full object-cover ${iconWidth} `}
        />
      </div>
      <span className={` ${fontSize}`}>{name}</span>
    </button>
  );
};

export default Tab;

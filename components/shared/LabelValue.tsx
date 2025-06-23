import React from "react";

interface LabelValueProps {
  label: string;
  value: string | number | React.ReactNode;
  horizontal?: boolean;
}

const LabelValue: React.FC<LabelValueProps> = ({
  label,
  value,
  horizontal = true,
}) => {
  return (
    <div className= { horizontal ?  "flex" : "flex flex-col" }>
      <span className="md:w-60 w-[50%] font-normal text-[#555353]">
        {label}
      </span>
      <span className="w-[50%] text-[var(--text-gray-primary)]">: {value}</span>
    </div>
  );
};

export default LabelValue;

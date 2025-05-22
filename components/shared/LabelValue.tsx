import React from "react";

interface LabelValueProps {
  label: string;
  value: string | number | React.ReactNode;
}

const LabelValue: React.FC<LabelValueProps> = ({ label, value }) => {
  return (
    <div className="flex">
      <span className="md:w-60 w-[50%] font-normal text-[#555353]">{label}</span>
      <span className="w-[50%] text-[var(--text-gray-primary)]">: {value}</span>
    </div>
  );
};

export default LabelValue;

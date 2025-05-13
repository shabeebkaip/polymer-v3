import React from "react";

interface LabelValueProps {
  label: string;
  value: string | number | React.ReactNode;
}

const LabelValue: React.FC<LabelValueProps> = ({ label, value }) => {
  return (
    <div className="flex">
      <span className="w-60 font-normal text-[#555353]">{label}</span>
      <span className="text-[var(--text-gray-primary)]">: {value}</span>
    </div>
  );
};

export default LabelValue;

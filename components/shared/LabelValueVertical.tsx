import React from "react";

interface LabelValueVerticalProps {
  label: string;
  value: string | number | React.ReactNode;
}

const LabelValueVertical: React.FC<LabelValueVerticalProps> = ({
  label,
  value,
}) => {
  return (
    <div>
      <h4>{label}</h4>
      <p className="text-[var(--dark-main)] text-sm">{value || "N/A"}</p>
    </div>
  );
};

export default LabelValueVertical;

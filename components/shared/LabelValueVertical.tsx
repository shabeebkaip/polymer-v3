import React from "react";
import { LabelValueVerticalProps } from "@/types/shared";

const LabelValueVertical: React.FC<LabelValueVerticalProps> = ({
  label,
  value,
}) => {
  return (
    <div>
      <h4 className="font-semibold">{label}</h4>
      <p className="text-[var(--text-gray-primary)] text-sm">{value || "N/A"}</p>
    </div>
  );
};

export default LabelValueVertical;

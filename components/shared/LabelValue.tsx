import React from "react";

interface LabelValueProps {
  label: string;
  value: string | number | React.ReactNode;
  horizontal?: boolean;
  compact?: boolean;
}

const LabelValue: React.FC<LabelValueProps> = ({
  label,
  value,
  horizontal = true,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </dt>
        <dd className="text-sm font-semibold text-gray-900">
          {value}
        </dd>
      </div>
    );
  }

  return (
    <div className={horizontal ? "flex items-start justify-between py-2" : "flex flex-col py-2"}>
      <dt className={horizontal ? "text-sm font-medium text-gray-600 w-1/2" : "text-sm font-medium text-gray-600 mb-1"}>
        {label}
      </dt>
      <dd className={horizontal ? "text-sm text-gray-900 w-1/2 text-right" : "text-sm text-gray-900"}>
        {value}
      </dd>
    </div>
  );
};

export default LabelValue;

import React from 'react';

interface InfoItemProps {
  label: string;
  value?: string | number;
  icon?: React.ReactNode;
}

export const InfoItem: React.FC<InfoItemProps> = ({ label, value, icon }) => {
  if (!value) return null;

  return (
    <div className="flex items-start gap-2">
      {icon}
      <div>
        <p className="text-xs text-gray-600 mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
};

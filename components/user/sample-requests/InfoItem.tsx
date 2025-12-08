import React from 'react';

interface InfoItemProps {
  label: string;
  value: string | number | null | undefined;
  valueClassName?: string;
}

export const InfoItem: React.FC<InfoItemProps> = ({ 
  label, 
  value, 
  valueClassName = "text-sm text-gray-900" 
}) => {
  if (!value) return null;
  
  return (
    <div>
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p className={valueClassName}>{value}</p>
    </div>
  );
};

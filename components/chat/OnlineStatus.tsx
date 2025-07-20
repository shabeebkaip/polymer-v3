import React from 'react';

interface OnlineStatusProps {
  isOnline: boolean;
  className?: string;
}

export const OnlineStatus: React.FC<OnlineStatusProps> = ({
  isOnline,
  className = '',
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div
        className={`w-3 h-3 rounded-full mr-2 ${
          isOnline ? 'bg-green-500' : 'bg-gray-400'
        }`}
      />
      <span className="text-sm text-gray-600">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};
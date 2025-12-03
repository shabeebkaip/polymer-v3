'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

interface CommentIndicatorProps {
  count: number;
  className?: string;
  compact?: boolean;
}

/**
 * Compact comment indicator for table/list views
 * Shows icon with count badge
 */
export const CommentIndicator: React.FC<CommentIndicatorProps> = ({
  count,
  className = '',
  compact = false,
}) => {
  if (count === 0) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <MessageSquare className="w-4 h-4 text-gray-300" />
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <MessageSquare className="w-4 h-4 text-blue-600" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <MessageSquare className="w-4 h-4 text-blue-600" />
      <span className="text-sm font-medium text-blue-600">{count}</span>
    </div>
  );
};

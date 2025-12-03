'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

interface CommentBadgeProps {
  count: number;
  className?: string;
}

export const CommentBadge: React.FC<CommentBadgeProps> = ({ count, className = '' }) => {
  if (count === 0) return null;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <MessageSquare className="w-4 h-4 text-blue-600" />
      <span className="text-sm font-medium text-blue-600">
        {count} {count === 1 ? 'Comment' : 'Comments'}
      </span>
    </div>
  );
};

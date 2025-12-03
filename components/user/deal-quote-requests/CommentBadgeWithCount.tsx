'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useCommentCount } from '@/hooks/useCommentCount';

interface CommentBadgeWithCountProps {
  dealQuoteRequestId: string;
  className?: string;
}

export const CommentBadgeWithCount: React.FC<CommentBadgeWithCountProps> = ({
  dealQuoteRequestId,
  className = '',
}) => {
  const { count, isLoading } = useCommentCount(dealQuoteRequestId);

  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <MessageSquare className="w-4 h-4 text-gray-400 animate-pulse" />
        <span className="text-sm text-gray-400">...</span>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <MessageSquare className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">No comments</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <MessageSquare className="w-4 h-4 text-blue-600" />
      <span className="text-sm font-medium text-blue-600">
        {count} {count === 1 ? 'comment' : 'comments'}
      </span>
    </div>
  );
};

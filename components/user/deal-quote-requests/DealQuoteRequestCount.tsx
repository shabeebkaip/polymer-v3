"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useDealQuoteRequestCount } from '@/hooks/useDealQuoteRequestCount';
import { MessageSquare, Loader2, ArrowRight } from 'lucide-react';

interface DealQuoteRequestCountProps {
  dealId: string;
  className?: string;
  clickable?: boolean;
}

/**
 * Component to display the count of quote requests for a specific deal
 * Shows loading state, error handling, and a clickable badge with the count
 */
export const DealQuoteRequestCount: React.FC<DealQuoteRequestCountProps> = ({ 
  dealId, 
  className = "",
  clickable = true
}) => {
  const router = useRouter();
  const { count, loading, error } = useDealQuoteRequestCount(dealId);

  const handleClick = () => {
    if (clickable && count > 0) {
      router.push(`/user/promotions/${dealId}/quote-requests`);
    }
  };

  if (loading) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 ${className}`}>
        <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 ${className}`}>
        <MessageSquare className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">-</span>
      </div>
    );
  }

  // Color coding based on count
  const getColorClasses = () => {
    if (count === 0) {
      return 'bg-gray-100 text-gray-600 border-gray-200';
    } else if (count <= 3) {
      return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200';
    } else if (count <= 10) {
      return 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200';
    } else {
      return 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200';
    }
  };

  const isClickable = clickable && count > 0;

  return (
    <div 
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getColorClasses()} ${className} ${
        isClickable ? 'cursor-pointer transition-all duration-200 hover:scale-105 group' : 'cursor-default'
      }`}
      title={isClickable ? 'Click to view quote requests' : undefined}
    >
      <MessageSquare className="w-4 h-4" />
      <span className="text-sm font-semibold">{count}</span>
      <span className="text-xs">{count === 1 ? 'request' : 'requests'}</span>
      {isClickable && (
        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -ml-1" />
      )}
    </div>
  );
};

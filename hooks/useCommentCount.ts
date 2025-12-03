import { useState, useEffect } from 'react';
import { commentService } from '@/apiServices/comments';

/**
 * Hook to fetch comment count for a deal quote request
 */
export const useCommentCount = (dealQuoteRequestId: string) => {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dealQuoteRequestId) return;

    const fetchCount = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await commentService.getCommentCount(dealQuoteRequestId);
        setCount(response.data.count);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch comment count');
        console.error('Failed to fetch comment count:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();
  }, [dealQuoteRequestId]);

  return { count, isLoading, error };
};

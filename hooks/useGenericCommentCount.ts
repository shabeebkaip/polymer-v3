import { useState, useEffect } from 'react';
import { genericCommentService, type CommentType } from '@/apiServices/genericComments';

/**
 * Hook to fetch comment count for any comment type
 */
export const useGenericCommentCount = (
  commentType: CommentType,
  requestId: string
) => {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;

    const fetchCount = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await genericCommentService.getCommentCount(
          commentType,
          requestId
        );
        setCount(response.count);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch comment count');
        console.error('Failed to fetch comment count:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();
  }, [commentType, requestId]);

  return { count, isLoading, error };
};

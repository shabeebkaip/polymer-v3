import { useState, useEffect } from 'react';
import { getDealQuoteRequestsByDealId } from '@/apiServices/user';

/**
 * Custom hook to fetch and track the number of quote requests for a specific deal
 * @param dealId - The ID of the deal to fetch quote requests for
 * @param enabled - Whether to fetch the data (default: true)
 * @returns Object containing count, loading state, and error
 */
export const useDealQuoteRequestCount = (dealId: string | undefined, enabled: boolean = true) => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!dealId || !enabled) {
      return;
    }

    const fetchCount = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await getDealQuoteRequestsByDealId(dealId);
        
        if (response.success && response.meta) {
          setCount(response.meta.total || 0);
        } else {
          setCount(0);
        }
      } catch (err: any) {
        console.error('Error fetching deal quote request count:', err);
        setError(err.message || 'Failed to fetch quote request count');
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [dealId, enabled]);

  return { count, loading, error };
};

import { useSharedState } from "@/stores/sharedStore";

/**
 * Cache Management Utility
 * Provides methods to manage application-wide cache invalidation
 */
export class CacheManager {
  private static instance: CacheManager;
  
  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Invalidate all caches (useful after user actions that affect data)
   */
  invalidateAllCaches(): void {
    const { invalidateCache } = useSharedState.getState();
    invalidateCache();
    console.log('🗑️ All caches invalidated');
  }

  /**
   * Invalidate specific cache
   */
  invalidateCache(cacheKey: string): void {
    const { invalidateCache } = useSharedState.getState();
    invalidateCache(cacheKey);
    console.log(`🗑️ Cache invalidated: ${cacheKey}`);
  }

  /**
   * Refresh all home page data (force API calls)
   */
  async refreshHomeData(): Promise<void> {
    const store = useSharedState.getState();
    
    console.log('🔄 Refreshing all home page data...');
    
    await Promise.all([
      store.fetchIndustries(true),
      store.fetchProductFamilies(true),
      store.fetchSellers(true),
      store.fetchBuyerOpportunities(true),
      store.fetchSuppliersSpecialDeals(true),
    ]);
    
    console.log('✅ Home page data refreshed');
  }

  /**
   * Check if any cache is expired
   */
  isAnyCacheExpired(): boolean {
    const store = useSharedState.getState();
    
    const cacheKeys = [
      'industries',
      'productFamilies', 
      'sellers',
      'buyerOpportunities',
      'suppliersSpecialDeals'
    ];

    return cacheKeys.some(key => !store.isCacheValid(key));
  }

  /**
   * Get cache status for debugging
   */
  getCacheStatus(): Record<string, { valid: boolean; lastFetch?: number }> {
    const store = useSharedState.getState();
    
    const cacheKeys = [
      'industries',
      'productFamilies', 
      'sellers',
      'buyerOpportunities',
      'suppliersSpecialDeals',
      'sidebar'
    ];

    const status: Record<string, { valid: boolean; lastFetch?: number }> = {};
    
    cacheKeys.forEach(key => {
      const cacheData = store[`${key}Cache` as keyof typeof store] as any;
      status[key] = {
        valid: store.isCacheValid(key),
        lastFetch: cacheData?.lastFetch
      };
    });

    return status;
  }
}

// Export singleton instance
export const cacheManager = CacheManager.getInstance();

// Hook for using cache manager in React components
export const useCacheManager = () => {
  return cacheManager;
};

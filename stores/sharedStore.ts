import { create } from "zustand";
import {
  getIndustryList,
  getProductFamilies,
  getSellers,
} from "@/apiServices/shared";
import { getBuyerOpportunities, getSuppliersSpecialDeals } from "@/apiServices/dealsAndRequests";
import { CacheMetadata, SharedState } from "@/types/shared";

// Cache configuration
const CACHE_DURATION = {
  industries: 30 * 60 * 1000, // 30 minutes
  productFamilies: 30 * 60 * 1000, // 30 minutes  
  sellers: 15 * 60 * 1000, // 15 minutes
  buyerOpportunities: 5 * 60 * 1000, // 5 minutes (more dynamic)
  suppliersSpecialDeals: 5 * 60 * 1000, // 5 minutes (more dynamic)
};

export const useSharedState = create<SharedState>((set, get) => ({
  industries: [],
  productFamilies: [],
  sellers: [],
  sellersTotal: 0,
  buyerOpportunities: [],
  suppliersSpecialDeals: [],
  
  // Cache metadata
  industriesCache: null,
  productFamiliesCache: null,
  sellersCache: null,
  buyerOpportunitiesCache: null,
  suppliersSpecialDealsCache: null,
  
  industriesLoading: false, // Changed default to false since we have caching
  familiesLoading: false,
  sellersLoading: false,
  buyerOpportunitiesLoading: false,
  suppliersSpecialDealsLoading: false,

  // Cache management helpers
  isCacheValid: (cacheKey: string) => {
    const state = get();
    const cache = state[`${cacheKey}Cache` as keyof SharedState] as CacheMetadata | null;
    
    if (!cache) return false;
    
    const now = Date.now();
    return (now - cache.lastFetch) < cache.ttl;
  },

  invalidateCache: (cacheKey?: string) => {
    if (cacheKey) {
      set({ [`${cacheKey}Cache`]: null } as any);
    } else {
      // Invalidate all caches
      set({
        industriesCache: null,
        productFamiliesCache: null,
        sellersCache: null,
        buyerOpportunitiesCache: null,
        suppliersSpecialDealsCache: null,
      });
    }
  },

  fetchIndustries: async (forceRefresh = false) => {
    const state = get();
    
    // Check cache validity
    if (!forceRefresh && state.industries.length > 0 && state.isCacheValid('industries')) {
            return;
    }

    set({ industriesLoading: true });

    try {
      const res = await getIndustryList();
      const now = Date.now();
      
      set({ 
        industries: res?.data || [], 
        industriesLoading: false,
        industriesCache: {
          lastFetch: now,
          ttl: CACHE_DURATION.industries
        }
      });
    } catch (err) {
      console.error("Failed to fetch industries", err);
      set({ industriesLoading: false });
    }
  },

  fetchProductFamilies: async (forceRefresh = false) => {
    const state = get();
    
    // Check cache validity
    if (!forceRefresh && state.productFamilies.length > 0 && state.isCacheValid('productFamilies')) {
      return;
    }

    set({ familiesLoading: true });

    try {
      const res = await getProductFamilies();
      const now = Date.now();
      
      set({ 
        productFamilies: res?.data || [], 
        familiesLoading: false,
        productFamiliesCache: {
          lastFetch: now,
          ttl: CACHE_DURATION.productFamilies
        }
      });
    } catch (err) {
      console.error("Failed to fetch product families", err);
      set({ familiesLoading: false });
    }
  },

  fetchSellers: async (forceRefresh = false) => {
    const state = get();
    
    // Check cache validity
    if (!forceRefresh && state.sellers.length > 0 && state.isCacheValid('sellers')) {
      return;
    }

    set({ sellersLoading: true });

    try {
      const res = await getSellers();
      const now = Date.now();
      
      set({ 
        sellers: res?.data || [], 
        sellersLoading: false,
        sellersCache: {
          lastFetch: now,
          ttl: CACHE_DURATION.sellers
        }
      });
    } catch (err) {
      console.error("Failed to fetch sellers", err);
      set({ sellersLoading: false });
    }
  },

  fetchBuyerOpportunities: async (forceRefresh = false) => {
    const state = get();
    
    // Check cache validity
    if (!forceRefresh && state.buyerOpportunities.length > 0 && state.isCacheValid('buyerOpportunities')) {
      return;
    }

    set({ buyerOpportunitiesLoading: true });

    try {
      const res = await getBuyerOpportunities();
      const now = Date.now();
      
      set({ 
        buyerOpportunities: res?.data || [], 
        buyerOpportunitiesLoading: false,
        buyerOpportunitiesCache: {
          lastFetch: now,
          ttl: CACHE_DURATION.buyerOpportunities
        }
      });
    } catch (err) {
      console.error("Failed to fetch buyer opportunities", err);
      set({ buyerOpportunitiesLoading: false });
    }
  },

  fetchSuppliersSpecialDeals: async (forceRefresh = false) => {
    const state = get();
    
    // Check cache validity
    if (!forceRefresh && state.suppliersSpecialDeals.length > 0 && state.isCacheValid('suppliersSpecialDeals')) {
      return;
    }

    set({ suppliersSpecialDealsLoading: true });

    try {
      const res = await getSuppliersSpecialDeals();
      const now = Date.now();
      
      set({ 
        suppliersSpecialDeals: res?.data || [], 
        suppliersSpecialDealsLoading: false,
        suppliersSpecialDealsCache: {
          lastFetch: now,
          ttl: CACHE_DURATION.suppliersSpecialDeals
        }
      });
    } catch (err) {
      console.error("Failed to fetch suppliers special deals", err);
      set({ suppliersSpecialDealsLoading: false });
    }
  },

  // Setter methods for SSR hydration with cache metadata
  setIndustries: (industries) => {
    const now = Date.now();
    set({ 
      industries, 
      industriesLoading: false,
      industriesCache: {
        lastFetch: now,
        ttl: CACHE_DURATION.industries
      }
    });
  },

  setProductFamilies: (productFamilies) => {
    const now = Date.now();
    set({ 
      productFamilies, 
      familiesLoading: false,
      productFamiliesCache: {
        lastFetch: now,
        ttl: CACHE_DURATION.productFamilies
      }
    });
  },

  setSellers: (sellers, total) => {
    const now = Date.now();
    set({
      sellers,
      sellersTotal: total ?? sellers.length,
      sellersLoading: false,
      sellersCache: {
        lastFetch: now,
        ttl: CACHE_DURATION.sellers
      }
    });
  },

  setBuyerOpportunities: (buyerOpportunities) => {
    const now = Date.now();
    set({ 
      buyerOpportunities, 
      buyerOpportunitiesLoading: false,
      buyerOpportunitiesCache: {
        lastFetch: now,
        ttl: CACHE_DURATION.buyerOpportunities
      }
    });
  },

  setSuppliersSpecialDeals: (suppliersSpecialDeals) => {
    const now = Date.now();
    set({ 
      suppliersSpecialDeals, 
      suppliersSpecialDealsLoading: false,
      suppliersSpecialDealsCache: {
        lastFetch: now,
        ttl: CACHE_DURATION.suppliersSpecialDeals
      }
    });
  },
}));

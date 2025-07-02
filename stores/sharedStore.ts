import { create } from "zustand";
import {
  getIndustryList,
  getProductFamilies,
  getSellers,
} from "@/apiServices/shared";
import { getBuyerOpportunities, getSuppliersSpecialDeals } from "@/apiServices/dealsAndRequests";
import { getSidebarList } from "@/apiServices/user";

interface SidebarSubItem {
  displayName: string;
  route: string;
  icon?: string;
}

interface SidebarItem {
  displayName: string;
  route: string;
  user: string;
  icon?: string;
  subItems?: SidebarSubItem[];
}

interface CacheMetadata {
  lastFetch: number;
  ttl: number; // Time to live in milliseconds
}

interface SharedState {
  industries: any[];
  productFamilies: any[];
  sellers: any[];
  buyerOpportunities: any[];
  suppliersSpecialDeals: any[];
  sidebarItems: SidebarItem[];
  
  // Cache metadata
  industriesCache: CacheMetadata | null;
  productFamiliesCache: CacheMetadata | null;
  sellersCache: CacheMetadata | null;
  buyerOpportunitiesCache: CacheMetadata | null;
  suppliersSpecialDealsCache: CacheMetadata | null;
  sidebarCache: CacheMetadata | null;
  
  industriesLoading: boolean;
  familiesLoading: boolean;
  sellersLoading: boolean;
  buyerOpportunitiesLoading: boolean;
  suppliersSpecialDealsLoading: boolean;
  sidebarLoading: boolean;
  
  // Enhanced fetch methods with caching
  fetchIndustries: (forceRefresh?: boolean) => Promise<void>;
  fetchProductFamilies: (forceRefresh?: boolean) => Promise<void>;
  fetchSellers: (forceRefresh?: boolean) => Promise<void>;
  fetchBuyerOpportunities: (forceRefresh?: boolean) => Promise<void>;
  fetchSuppliersSpecialDeals: (forceRefresh?: boolean) => Promise<void>;
  fetchSidebarItems: (retryCount?: number, forceRefresh?: boolean) => Promise<void>;
  refreshSidebarItems: () => Promise<void>;
  
  // Cache management
  invalidateCache: (cacheKey?: string) => void;
  isCacheValid: (cacheKey: string) => boolean;
  
  // Setter methods for SSR hydration
  setIndustries: (industries: any[]) => void;
  setProductFamilies: (families: any[]) => void;
  setSellers: (sellers: any[]) => void;
  setBuyerOpportunities: (opportunities: any[]) => void;
  setSuppliersSpecialDeals: (deals: any[]) => void;
  setSidebarItems: (items: SidebarItem[]) => void;
}

// Cache configuration
const CACHE_DURATION = {
  industries: 30 * 60 * 1000, // 30 minutes
  productFamilies: 30 * 60 * 1000, // 30 minutes  
  sellers: 15 * 60 * 1000, // 15 minutes
  buyerOpportunities: 5 * 60 * 1000, // 5 minutes (more dynamic)
  suppliersSpecialDeals: 5 * 60 * 1000, // 5 minutes (more dynamic)
  sidebar: 60 * 60 * 1000, // 1 hour
};

export const useSharedState = create<SharedState>((set, get) => ({
  industries: [],
  productFamilies: [],
  sellers: [],
  buyerOpportunities: [],
  suppliersSpecialDeals: [],
  sidebarItems: [],
  
  // Cache metadata
  industriesCache: null,
  productFamiliesCache: null,
  sellersCache: null,
  buyerOpportunitiesCache: null,
  suppliersSpecialDealsCache: null,
  sidebarCache: null,
  
  industriesLoading: false, // Changed default to false since we have caching
  familiesLoading: false,
  sellersLoading: false,
  buyerOpportunitiesLoading: false,
  suppliersSpecialDealsLoading: false,
  sidebarLoading: false,

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
        sidebarCache: null,
      });
    }
  },

  fetchIndustries: async (forceRefresh = false) => {
    const state = get();
    
    // Check cache validity
    if (!forceRefresh && state.industries.length > 0 && state.isCacheValid('industries')) {
      console.log('🚀 Industries loaded from cache');
      return;
    }

    set({ industriesLoading: true });

    try {
      console.log('🌐 Fetching industries from API');
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
      console.log('🚀 Product families loaded from cache');
      return;
    }

    set({ familiesLoading: true });

    try {
      console.log('🌐 Fetching product families from API');
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
      console.log('🚀 Sellers loaded from cache');
      return;
    }

    set({ sellersLoading: true });

    try {
      console.log('🌐 Fetching sellers from API');
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
      console.log('🚀 Buyer opportunities loaded from cache');
      return;
    }

    set({ buyerOpportunitiesLoading: true });

    try {
      console.log('🌐 Fetching buyer opportunities from API');
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
      console.log('🚀 Suppliers special deals loaded from cache');
      return;
    }

    set({ suppliersSpecialDealsLoading: true });

    try {
      console.log('🌐 Fetching suppliers special deals from API');
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

  fetchSidebarItems: async (retryCount = 0, forceRefresh = false) => {
    const state = get();
    
    // Check cache validity
    if (!forceRefresh && state.sidebarItems.length > 0 && state.isCacheValid('sidebar')) {
      console.log('🚀 Sidebar items loaded from cache');
      return;
    }
    
    console.log("fetchSidebarItems called", { retryCount, loading: state.sidebarLoading });
    
    // Avoid multiple concurrent requests
    if (state.sidebarLoading) {
      console.log("Already loading sidebar items, skipping");
      return;
    }
    
    set({ sidebarLoading: true });

    try {
      console.log("🌐 Fetching sidebar items from API");
      const res = await getSidebarList();
      const now = Date.now();
      
      if (res?.success && res?.data) {
        set({ 
          sidebarItems: res.data,
          sidebarLoading: false,
          sidebarCache: {
            lastFetch: now,
            ttl: CACHE_DURATION.sidebar
          }
        });
        console.log("✅ Sidebar items fetched successfully:", res.data.length);
      } else {
        throw new Error(res?.message || "Failed to fetch sidebar items");
      }
    } catch (error) {
      console.error("❌ Failed to fetch sidebar items:", error);
      
      if (retryCount < 2) {
        console.log(`🔄 Retrying sidebar fetch (attempt ${retryCount + 1})`);
        setTimeout(() => {
          get().fetchSidebarItems(retryCount + 1, forceRefresh);
        }, 1000 * (retryCount + 1));
      } else {
        set({ sidebarLoading: false });
        console.error("❌ Max retries reached for sidebar items");
      }
    }
  },

  refreshSidebarItems: async () => {
    // Force refresh by invalidating cache
    get().invalidateCache('sidebar');
    return get().fetchSidebarItems(0, true);
  },

  // Setter methods for SSR hydration with cache metadata
  setIndustries: (industries) => {
    console.log("setIndustries called with:", industries?.length);
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
    console.log("setProductFamilies called with:", productFamilies?.length);
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

  setSellers: (sellers) => {
    console.log("setSellers called with:", sellers?.length);
    const now = Date.now();
    set({ 
      sellers, 
      sellersLoading: false,
      sellersCache: {
        lastFetch: now,
        ttl: CACHE_DURATION.sellers
      }
    });
  },

  setBuyerOpportunities: (buyerOpportunities) => {
    console.log("setBuyerOpportunities called with:", buyerOpportunities?.length);
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
    console.log("setSuppliersSpecialDeals called with:", suppliersSpecialDeals?.length);
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

  setSidebarItems: (sidebarItems) => {
    console.log("setSidebarItems called with:", sidebarItems?.length);
    const now = Date.now();
    set({ 
      sidebarItems, 
      sidebarLoading: false,
      sidebarCache: {
        lastFetch: now,
        ttl: CACHE_DURATION.sidebar
      }
    });
  },
}));

import { create } from "zustand";
import {
  getIndustryList,
  getProductFamilies,
  getSellers,
} from "@/apiServices/shared";
import { getBuyerOpportunities, getSuppliersSpecialDeals } from "@/apiServices/dealsAndRequests";

interface SharedState {
  industries: any[];
  productFamilies: any[];
  sellers: any[];
  buyerOpportunities: any[];
  suppliersSpecialDeals: any[];
  industriesLoading: boolean;
  familiesLoading: boolean;
  sellersLoading: boolean;
  buyerOpportunitiesLoading: boolean;
  suppliersSpecialDealsLoading: boolean;
  fetchIndustries: () => Promise<void>;
  fetchProductFamilies: () => Promise<void>;
  fetchSellers: () => Promise<void>;
  fetchBuyerOpportunities: () => Promise<void>;
  fetchSuppliersSpecialDeals: () => Promise<void>;
  // Setter methods for SSR hydration
  setIndustries: (industries: any[]) => void;
  setProductFamilies: (families: any[]) => void;
  setSellers: (sellers: any[]) => void;
  setBuyerOpportunities: (opportunities: any[]) => void;
  setSuppliersSpecialDeals: (deals: any[]) => void;
}

export const useSharedState = create<SharedState>((set, get) => ({
  industries: [],
  productFamilies: [],
  sellers: [],
  buyerOpportunities: [],
  suppliersSpecialDeals: [],
  industriesLoading: true,
  familiesLoading: true,
  sellersLoading: true,
  buyerOpportunitiesLoading: true,
  suppliersSpecialDealsLoading: true,

  fetchIndustries: async () => {
    const state = get();
    if (state.industries.length > 0) return; // Already fetched

    set({ industriesLoading: true });

    try {
      const res = await getIndustryList();
      set({ industries: res?.data || [], industriesLoading: false });
    } catch (err) {
      console.error("Failed to fetch industries", err);
      set({ industriesLoading: false });
    }
  },

  fetchProductFamilies: async () => {
    const state = get();
    if (state.productFamilies.length > 0) return; // Already fetched

    set({ familiesLoading: true });

    try {
      const res = await getProductFamilies();
      set({ productFamilies: res?.data || [], familiesLoading: false });
    } catch (err) {
      console.error("Failed to fetch product families", err);
      set({ familiesLoading: false });
    }
  },

  fetchSellers: async () => {
    const state = get();
    if (state.sellers.length > 0) return; // Already fetched

    set({ sellersLoading: true });

    try {
      const res = await getSellers();
      set({ sellers: res?.data || [], sellersLoading: false });
    } catch (err) {
      console.error("Failed to fetch sellers", err);
      set({ sellersLoading: false });
    }
  },

  fetchBuyerOpportunities: async () => {
    const state = get();
    if (state.buyerOpportunities.length > 0) return; // Already fetched

    set({ buyerOpportunitiesLoading: true });

    try {
      const res = await getBuyerOpportunities();
      set({ buyerOpportunities: res?.data || [], buyerOpportunitiesLoading: false });
    } catch (err) {
      console.error("Failed to fetch buyer opportunities", err);
      set({ buyerOpportunitiesLoading: false });
    }
  },

  fetchSuppliersSpecialDeals: async () => {
    const state = get();
    if (state.suppliersSpecialDeals.length > 0) return; // Already fetched

    set({ suppliersSpecialDealsLoading: true });

    try {
      const res = await getSuppliersSpecialDeals();
      set({ suppliersSpecialDeals: res?.data || [], suppliersSpecialDealsLoading: false });
    } catch (err) {
      console.error("Failed to fetch suppliers special deals", err);
      set({ suppliersSpecialDealsLoading: false });
    }
  },

  // Setter methods for SSR hydration
  setIndustries: (industries) => {
    console.log("setIndustries called with:", industries?.length);
    set({ industries, industriesLoading: false });
  },

  setProductFamilies: (productFamilies) => {
    console.log("setProductFamilies called with:", productFamilies?.length);
    set({ productFamilies, familiesLoading: false });
  },

  setSellers: (sellers) => {
    console.log("setSellers called with:", sellers?.length);
    set({ sellers, sellersLoading: false });
  },

  setBuyerOpportunities: (buyerOpportunities) => {
    console.log("setBuyerOpportunities called with:", buyerOpportunities?.length);
    set({ buyerOpportunities, buyerOpportunitiesLoading: false });
  },

  setSuppliersSpecialDeals: (suppliersSpecialDeals) => {
    console.log("setSuppliersSpecialDeals called with:", suppliersSpecialDeals?.length);
    set({ suppliersSpecialDeals, suppliersSpecialDealsLoading: false });
  },
}));

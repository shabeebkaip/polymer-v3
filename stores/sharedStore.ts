import { create } from "zustand";
import {
  getIndustryList,
  getProductFamilies,
  getSellers,
} from "@/apiServices/shared";

interface SharedState {
  industries: any[];
  productFamilies: any[];
  sellers: any[];
  industriesLoading: boolean;
  familiesLoading: boolean;
  sellersLoading: boolean;
  fetchIndustries: () => Promise<void>;
  fetchProductFamilies: () => Promise<void>;
  fetchSellers: () => Promise<void>;
  // Setter methods for SSR hydration
  setIndustries: (industries: any[]) => void;
  setProductFamilies: (families: any[]) => void;
  setSellers: (sellers: any[]) => void;
}

export const useSharedState = create<SharedState>((set, get) => ({
  industries: [],
  productFamilies: [],
  sellers: [],
  industriesLoading: true,
  familiesLoading: true,
  sellersLoading: true,

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

  // Setter methods for SSR hydration
  setIndustries: (industries) => {
    set({ industries, industriesLoading: false });
  },

  setProductFamilies: (productFamilies) => {
    set({ productFamilies, familiesLoading: false });
  },

  setSellers: (sellers) => {
    set({ sellers, sellersLoading: false });
  },
}));

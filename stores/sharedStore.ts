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
}

export const useSharedState = create<SharedState>((set, get) => ({
  industries: [],
  productFamilies: [],
  sellers: [],
  industriesLoading: true,
  familiesLoading: true,
  sellersLoading: true,

  fetchIndustries: async () => {
    if (get().industries.length) return;

    set({ industriesLoading: true });

    try {
      const res = await getIndustryList();
      set({ industries: res?.data || [] });
    } catch (err) {
      console.error("Failed to fetch industries", err);
    } finally {
      set({ industriesLoading: false });
    }
  },

  fetchProductFamilies: async () => {
    if (get().productFamilies.length) return;

    set({ familiesLoading: true });

    try {
      const res = await getProductFamilies();
      set({ productFamilies: res?.data || [] });
    } catch (err) {
      console.error("Failed to fetch product families", err);
    } finally {
      set({ familiesLoading: false });
    }
  },

  fetchSellers: async () => {
    if (get().sellers.length) return;

    set({ sellersLoading: true });

    try {
      const res = await getSellers();
      set({ sellers: res?.data || [] });
    } catch (err) {
      console.error("Failed to fetch sellers", err);
    } finally {
      set({ sellersLoading: false });
    }
  },
}));

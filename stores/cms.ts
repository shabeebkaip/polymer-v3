import { create } from "zustand";
import {
  getBenefitsOfBuyers,
  getBenefitsOfSuppliers,
  getSocialLinks,
} from "@/apiServices/cms";
import { BenefitsContent } from "@/types/cms";

interface CmsState {
  buyersBenefits: BenefitsContent;
  suppliersBenefits: BenefitsContent;
  socialLinks: any[];
  loading: boolean;
  getBenefitsOfBuyers: () => Promise<void>;
  getBenefitsOfSuppliers: () => Promise<void>;
  getSocialLinks: () => Promise<void>;
}

export const useCmsStore = create<CmsState>((set, get) => ({
  buyersBenefits: [],
  suppliersBenefits: [],
  socialLinks: [],
  loading: false,

  getBenefitsOfBuyers: async () => {
    set({ loading: true });
    try {
      const res = await getBenefitsOfBuyers();
      set({ buyersBenefits: res?.data || [] });
    } catch (error) {
      console.error("Failed to fetch benefits of buyers:", error);
    } finally {
      set({ loading: false });
    }
  },

  getBenefitsOfSuppliers: async () => {
    set({ loading: true });
    try {
      const res = await getBenefitsOfSuppliers();
      set({ suppliersBenefits: res?.data || [] });
    } catch (error) {
      console.error("Failed to fetch benefits of suppliers:", error);
    } finally {
      set({ loading: false });
    }
  },

  getSocialLinks: async () => {
    set({ loading: true });
    try {
      const res = await getSocialLinks();
      set({ socialLinks: res?.data || [] });
    } catch (error) {
      console.error("Failed to fetch social links:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

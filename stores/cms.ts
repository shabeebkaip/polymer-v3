import { create } from "zustand";
import {
  getBenefitsOfBuyers,
  getBenefitsOfSuppliers,
  getSocialLinks,
} from "@/apiServices/cms";
import { BenefitsContent, CmsState, HeroSectionContent, HomeSectionsContent, PolymerAdvantagesContent } from "@/types/cms";

export const useCmsStore = create<CmsState>((set, get) => ({
  buyersBenefits: {},
  suppliersBenefits: {},
  socialLinks: [],
  heroSection: {},
  polymerAdvantages: {},
  homeSections: {},
  loading: false,

  getBenefitsOfBuyers: async () => {
    const state = get();
    if (state.buyersBenefits.content?.description && state.buyersBenefits.content.description.length > 0) return; // Already fetched

    set({ loading: true });
    try {
      const res = await getBenefitsOfBuyers();
      set({ buyersBenefits: res?.data || {}, loading: false });
    } catch (error) {
      console.error("Failed to fetch benefits of buyers:", error);
      set({ loading: false });
    }
  },

  getBenefitsOfSuppliers: async () => {
    const state = get();
    if (state.suppliersBenefits.content?.description && state.suppliersBenefits.content.description.length > 0) return; // Already fetched

    set({ loading: true });
    try {
      const res = await getBenefitsOfSuppliers();
      set({ suppliersBenefits: res?.data || {}, loading: false });
    } catch (error) {
      console.error("Failed to fetch benefits of suppliers:", error);
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

  // Setter methods for SSR hydration
  setBuyersBenefits: (buyersBenefits) => {
    set({ buyersBenefits, loading: false });
  },

  setSuppliersBenefits: (suppliersBenefits) => {
    set({ suppliersBenefits, loading: false });
  },

  setHeroSection: (heroSection: HeroSectionContent) => {
    set({ heroSection });
  },

  setPolymerAdvantages: (polymerAdvantages: PolymerAdvantagesContent) => {
    set({ polymerAdvantages });
  },

  setHomeSections: (homeSections: HomeSectionsContent) => {
    set({ homeSections });
  },
}));

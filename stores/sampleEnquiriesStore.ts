import { create } from "zustand";
import { SampleEnquiry, SampleEnquiriesState } from "@/types/sample";

export const useSampleEnquiriesStore = create<SampleEnquiriesState>((set, get) => ({
  enquiries: [],
  meta: null,
  
  // Detail state
  enquiryDetail: null,
  loading: false,
  error: null,
  updating: false,
  
  // Actions
  setEnquiries: (enquiries, meta) => set({ enquiries, meta }),
  clearEnquiries: () => set({ enquiries: [], meta: null }),
  
  // Detail actions - optimized to prevent unnecessary updates
  setEnquiryDetail: (enquiry) => {
    const currentDetail = get().enquiryDetail;
    // Only update if the enquiry is different
    if (!currentDetail || currentDetail._id !== enquiry._id || JSON.stringify(currentDetail) !== JSON.stringify(enquiry)) {
      set({ enquiryDetail: enquiry, error: null });
    }
  },
  clearEnquiryDetail: () => {
    const currentDetail = get().enquiryDetail;
    // Only clear if there's actually a detail to clear
    if (currentDetail) {
      set({ enquiryDetail: null, error: null });
    }
  },
  setLoading: (loading) => {
    const currentLoading = get().loading;
    // Only update if loading state actually changed
    if (currentLoading !== loading) {
      set({ loading });
    }
  },
  setError: (error) => {
    const currentError = get().error;
    // Only update if error actually changed
    if (currentError !== error) {
      set({ error });
    }
  },
  setUpdating: (updating) => {
    const currentUpdating = get().updating;
    // Only update if updating state actually changed
    if (currentUpdating !== updating) {
      set({ updating });
    }
  },
}));

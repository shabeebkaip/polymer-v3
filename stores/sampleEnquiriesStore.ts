import { create } from "zustand";

interface SampleEnquiry {
  _id: string;
  user: any;
  product: any;
  quantity: number;
  uom: string;
  address: string;
  country: string;
  grade: any;
  application: string;
  expected_annual_volume: number;
  orderDate: string;
  neededBy: string;
  message: string;
  request_document: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
  count: number;
  limit: number;
}

interface SampleEnquiriesState {
  enquiries: SampleEnquiry[];
  meta: {
    pagination: PaginationMeta;
    filters: { search: string; status: string };
  } | null;
  
  // Detail state
  enquiryDetail: SampleEnquiry | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  
  // Actions
  setEnquiries: (enquiries: SampleEnquiry[], meta: any) => void;
  clearEnquiries: () => void;
  
  // Detail actions
  setEnquiryDetail: (enquiry: SampleEnquiry) => void;
  clearEnquiryDetail: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUpdating: (updating: boolean) => void;
}

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

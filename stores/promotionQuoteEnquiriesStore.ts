import { create } from "zustand";

// Define types for promotion quote enquiries
export interface DealQuoteEnquiry {
  _id: string;
  bestDealId?: {
    _id: string;
    productName?: string;
    description?: string;
    offerPrice?: number;
    [key: string]: any;
  };
  buyerId?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    email?: string;
    phone?: string;
    [key: string]: any;
  };
  sellerId?: string;
  desiredQuantity: number;
  shippingCountry?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPincode?: string;
  paymentTerms?: string;
  deliveryDeadline?: string | Date;
  message?: string;
  status: "pending" | "responded" | "accepted" | "rejected" | "cancelled";
  quotedPrice?: number;
  quotedQuantity?: number;
  estimatedDelivery?: string | Date;
  responseMessage?: string;
  quotationDocument?: {
    fileName?: string;
    fileUrl?: string;
    fileType?: string;
  };
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
  count: number;
  limit: number;
}

export interface PromotionQuoteEnquiriesState {
  enquiries: DealQuoteEnquiry[];
  meta: {
    pagination: PaginationMeta;
    filters: { search: string; status: string };
  } | null;
  enquiryDetail: DealQuoteEnquiry | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  setEnquiries: (enquiries: DealQuoteEnquiry[], meta: any) => void;
  clearEnquiries: () => void;
  setEnquiryDetail: (enquiry: DealQuoteEnquiry) => void;
  clearEnquiryDetail: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUpdating: (updating: boolean) => void;
}

export const usePromotionQuoteEnquiriesStore = create<PromotionQuoteEnquiriesState>((set, get) => ({
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

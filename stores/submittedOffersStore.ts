import { create } from "zustand";
import { getSellerSubmittedOffers, getSellerSubmittedOfferDetail } from "@/apiServices/user";

// Type definitions based on the actual API response structure provided by user
interface OfferUser {
  _id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
}

interface OfferProduct {
  _id: string;
  productName: string;
  chemicalName: string;
  tradeName: string;
}

interface BulkOrderDetails {
  sellerStatus: string;
  _id: string;
  user: OfferUser;
  product: OfferProduct;
  quantity: number;
  uom: string;
  city: string;
  country: string;
  destination: string;
  delivery_date: string;
  message: string;
  request_document?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  statusMessage: Array<{
    status: string;
    message: string;
    date: string;
    updatedBy: string;
    _id: string;
  }>;
}

interface BuyerInfo {
  name: string;
  email: string;
  company: string;
}

interface OrderDetails {
  id: string;
  product: OfferProduct;
  quantity: number;
  uom: string;
  city: string;
  country: string;
  deliveryDate: string;
  orderStatus: string;
  orderCreatedAt: string;
}

interface SubmittedOffer {
  _id: string;
  bulkOrderId: BulkOrderDetails;
  supplierId: string;
  pricePerUnit: number;
  availableQuantity: number;
  deliveryTimeInDays: number;
  incotermAndPackaging: string;
  message: string;
  status: string;
  statusMessage: Array<{
    status: string;
    message: string;
    date: string;
    updatedBy: string;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v: number;
  buyer: BuyerInfo;
  orderDetails: OrderDetails;
}

interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
  count: number;
  limit: number;
}

interface FilterMeta {
  status: string;
}

interface SummaryMeta {
  totalSubmitted: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface ApiMeta {
  pagination: PaginationMeta;
  filters: FilterMeta;
  summary: SummaryMeta;
}

interface SubmittedOffersState {
  offers: SubmittedOffer[];
  meta: ApiMeta | null;
  
  // Detail state
  offerDetail: SubmittedOffer | null;
  detailedOffer: DetailedSubmittedOffer | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setOffers: (offers: SubmittedOffer[], meta: ApiMeta | null) => void;
  clearOffers: () => void;
  fetchOffers: () => Promise<void>;
  
  // Detail actions
  setOfferDetail: (offer: SubmittedOffer) => void;
  clearOfferDetail: () => void;
  fetchOfferDetail: (offerId: string) => Promise<void>;
  setDetailedOffer: (offer: DetailedSubmittedOffer | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Detailed offer types based on the API response
interface DetailedOfferUser {
  _id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  address: string;
  phone: number;
}

interface DetailedOfferProduct {
  _id: string;
  productName: string;
  chemicalName: string;
  description: string;
  tradeName: string;
  countryOfOrigin: string;
  color: string;
  productImages: Array<{
    id: string;
    name: string;
    type: string;
    fileUrl: string;
    _id: string;
  }>;
}

interface DetailedBulkOrder {
  _id: string;
  user: DetailedOfferUser;
  product: DetailedOfferProduct;
  quantity: number;
  uom: string;
  city: string;
  country: string;
  delivery_date: string;
  status: string;
  createdAt: string;
}

interface DetailedBuyerInfo {
  name: string;
  email: string;
  company: string;
  phone: number;
  address: {
    full: string;
  };
}

interface StatusTimeline {
  status: string;
  message: string;
  date: string;
  updatedBy: string;
  _id: string;
}

interface DetailedOrderDetails {
  id: string;
  product: DetailedOfferProduct;
  quantity: number;
  uom: string;
  deliveryLocation: {
    city: string;
    country: string;
  };
  deliveryDate: string;
  orderStatus: string;
  orderCreatedAt: string;
}

interface DetailedSubmittedOffer {
  _id: string;
  bulkOrderId: DetailedBulkOrder;
  supplierId: string;
  pricePerUnit: number;
  availableQuantity: number;
  deliveryTimeInDays: number;
  incotermAndPackaging: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  statusMessage: StatusTimeline[];
  buyer: DetailedBuyerInfo;
  orderDetails: DetailedOrderDetails;
  statusTimeline: StatusTimeline[];
}

export const useSubmittedOffersStore = create<SubmittedOffersState>((set, get) => ({
  offers: [],
  meta: null,
  offerDetail: null,
  detailedOffer: null,
  loading: false,
  error: null,

  setOffers: (offers: SubmittedOffer[], meta: ApiMeta | null) => {
    set({ offers, meta });
  },

  clearOffers: () => {
    set({ offers: [], meta: null });
  },

  fetchOffers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getSellerSubmittedOffers();
      if (response.success) {
        const { setOffers } = get();
        setOffers(response.data || [], response.meta);
      } else {
        set({ error: "Failed to fetch submitted offers" });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "An error occurred while fetching offers" 
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchOfferDetail: async (offerId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await getSellerSubmittedOfferDetail(offerId);
      if (response.success) {
        set({ detailedOffer: response.data });
      } else {
        set({ error: "Failed to fetch offer details" });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "An error occurred while fetching offer details" 
      });
    } finally {
      set({ loading: false });
    }
  },

  setOfferDetail: (offer: SubmittedOffer) => {
    set({ offerDetail: offer });
  },

  setDetailedOffer: (offer: DetailedSubmittedOffer | null) => {
    set({ detailedOffer: offer });
  },

  clearOfferDetail: () => {
    set({ offerDetail: null, detailedOffer: null });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));

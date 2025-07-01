import { create } from "zustand";
import { getSampleRequestDetail, updateSampleRequestStatus, getQuoteRequestDetail, updateQuoteRequestStatus } from "@/apiServices/user";

// Type definitions based on the API response structure
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  userType: string;
}

interface ProductImage {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
}

interface Grade {
  _id: string;
  name: string;
  description: string;
}

interface Product {
  _id: string;
  productName: string;
  chemicalName: string;
  description: string;
  tradeName: string;
  countryOfOrigin: string;
  color: string;
  manufacturingMethod: string;
  productImages: ProductImage[];
  density: number;
  mfi: number;
  tensileStrength: number;
  elongationAtBreak: number;
  shoreHardness: number;
  waterAbsorption: number;
  createdBy: User;
}

interface SampleRequestDetail {
  _id: string;
  user: User;
  product: Product;
  grade: Grade;
  quantity: number;
  uom: string;
  phone: string;
  address: string;
  country: string;
  application: string;
  expected_annual_volume: number;
  orderDate: string;
  neededBy: string;
  message: string;
  request_document?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface QuoteRequestDetail {
  _id: string;
  user: User;
  product: Product;
  grade: Grade;
  quantity: number;
  uom: string;
  phone: string;
  address: string;
  country: string;
  application: string;
  expected_annual_volume: number;
  orderDate: string;
  neededBy: string;
  message: string;
  request_document?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface SampleRequestStore {
  sampleRequestDetail: SampleRequestDetail | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  fetchSampleRequestDetail: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string, statusMessage: string) => Promise<boolean>;
  clearSampleRequestDetail: () => void;
}

export const useSampleRequestStore = create<SampleRequestStore>((set, get) => ({
  sampleRequestDetail: null,
  loading: false,
  error: null,
  updating: false,

  fetchSampleRequestDetail: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await getSampleRequestDetail(id);
      if (response.success) {
        set({ 
          sampleRequestDetail: response.data, 
          loading: false, 
          error: null 
        });
      } else {
        set({ 
          loading: false, 
          error: "Failed to fetch sample request details" 
        });
      }
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : "An error occurred" 
      });
    }
  },

  updateStatus: async (id: string, status: string, statusMessage: string) => {
    set({ updating: true, error: null });
    try {
      console.log("🔍 Store: Updating sample request status:", { id, status, statusMessage });
      const response = await updateSampleRequestStatus(id, { 
        status: status as any, 
        statusMessage 
      });
      
      console.log("✅ Store: Sample request status response:", response);
      
      // Check if response has success property or just assume success if no error
      if (response?.success !== false) {
        // Refresh the data after successful update
        const { fetchSampleRequestDetail } = get();
        await fetchSampleRequestDetail(id);
        set({ updating: false });
        return true;
      } else {
        set({ 
          updating: false, 
          error: response?.message || "Failed to update status" 
        });
        return false;
      }
    } catch (error) {
      console.error("❌ Store: Error updating sample request status:", error);
      set({ 
        updating: false, 
        error: error instanceof Error ? error.message : "An error occurred" 
      });
      return false;
    }
  },

  clearSampleRequestDetail: () => {
    set({ 
      sampleRequestDetail: null, 
      loading: false, 
      error: null,
      updating: false
    });
  },
}));

interface QuoteRequestStore {
  quoteRequestDetail: QuoteRequestDetail | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  fetchQuoteRequestDetail: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string, statusMessage: string) => Promise<boolean>;
  clearQuoteRequestDetail: () => void;
}

export const useQuoteRequestStore = create<QuoteRequestStore>((set, get) => ({
  quoteRequestDetail: null,
  loading: false,
  error: null,
  updating: false,

  fetchQuoteRequestDetail: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await getQuoteRequestDetail(id);
      if (response.success) {
        set({ 
          quoteRequestDetail: response.data, 
          loading: false, 
          error: null 
        });
      } else {
        set({ 
          loading: false, 
          error: "Failed to fetch quote request details" 
        });
      }
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : "An error occurred" 
      });
    }
  },

  updateStatus: async (id: string, status: string, statusMessage: string) => {
    set({ updating: true, error: null });
    try {
      console.log("🔍 Store: Updating quote request status:", { id, status, statusMessage });
      const response = await updateQuoteRequestStatus(id, { 
        status: status as any, 
        statusMessage 
      });
      
      console.log("✅ Store: Quote request status response:", response);
      
      // Check if response has success property or just assume success if no error
      if (response?.success !== false) {
        // Refresh the data after successful update
        const { fetchQuoteRequestDetail } = get();
        await fetchQuoteRequestDetail(id);
        set({ updating: false });
        return true;
      } else {
        set({ 
          updating: false, 
          error: response?.message || "Failed to update status" 
        });
        return false;
      }
    } catch (error) {
      console.error("❌ Store: Error updating quote request status:", error);
      set({ 
        updating: false, 
        error: error instanceof Error ? error.message : "An error occurred" 
      });
      return false;
    }
  },

  clearQuoteRequestDetail: () => {
    set({ 
      quoteRequestDetail: null, 
      loading: false, 
      error: null,
      updating: false
    });
  },
}));

// Sample Requests List Store
interface SampleRequestListItem {
  _id: string;
  user: string;
  product?: {
    _id: string;
    productName: string;
    createdBy?: {
      _id: string;
      firstName: string;
      lastName: string;
      company: string;
      email: string;
    };
  };
  quantity: number;
  uom?: string;
  address?: string;
  country?: string;
  grade?: {
    _id: string;
    name: string;
  };
  application?: string;
  expected_annual_volume?: number;
  orderDate?: string;
  neededBy?: string;
  message?: string;
  request_document?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  statusMessage?: Array<{
    status: string;
    message: string;
    date: string;
    _id: string;
  }>;
}

interface SampleRequestsListStore {
  requests: SampleRequestListItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalRequests: number;
  pageSize: number;
  searchTerm: string;
  statusFilter: string;
  lastFetchParams: string | null; // To prevent duplicate calls
  
  // Actions
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setCurrentPage: (page: number) => void;
  fetchSampleRequests: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    forceRefresh?: boolean;
  }) => Promise<void>;
  clearFilters: () => void;
  reset: () => void;
}

export const useSampleRequestsListStore = create<SampleRequestsListStore>((set, get) => ({
  requests: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalRequests: 0,
  pageSize: 10,
  searchTerm: "",
  statusFilter: "all",
  lastFetchParams: null,

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status });
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
  },

  fetchSampleRequests: async (params = {}) => {
    const state = get();
    
    // Build actual params
    const actualParams = {
      page: params.page ?? state.currentPage,
      limit: params.limit ?? state.pageSize,
      ...(params.search && { search: params.search }),
      ...(params.status && params.status !== "all" && { status: params.status })
    };

    // Create a cache key to prevent duplicate calls
    const cacheKey = JSON.stringify(actualParams);
    
    // If we already fetched with these exact params and it's not a forced refresh, skip
    // Also check if we're currently loading to prevent race conditions
    if ((state.lastFetchParams === cacheKey && !params.forceRefresh) || state.loading) {
      console.log("🔄 Skipping duplicate/concurrent API call with params:", actualParams);
      return;
    }

    try {
      set({ loading: true, error: null, lastFetchParams: cacheKey });
      console.log("🔍 Fetching sample requests from store with params:", actualParams);
      
      const { getUserSampleRequests } = await import("@/apiServices/user");
      const response = await getUserSampleRequests(actualParams);

      if (response && response.data && Array.isArray(response.data)) {
        const pagination = response.meta?.pagination;
        
        set({
          requests: response.data,
          totalRequests: pagination?.total || response.total || response.data.length,
          totalPages: pagination?.totalPages || Math.ceil((response.total || response.data.length) / actualParams.limit),
          currentPage: actualParams.page,
          loading: false,
          error: null
        });
      } else {
        set({
          requests: [],
          totalRequests: 0,
          totalPages: 1,
          loading: false,
          error: null
        });
      }
    } catch (error) {
      console.error("Error fetching sample requests:", error);
      set({
        requests: [],
        totalRequests: 0,
        totalPages: 1,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch sample requests",
        lastFetchParams: null // Reset cache on error
      });
    }
  },

  clearFilters: () => {
    set({
      searchTerm: "",
      statusFilter: "all",
      currentPage: 1,
      lastFetchParams: null
    });
  },

  reset: () => {
    set({
      requests: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalRequests: 0,
      searchTerm: "",
      statusFilter: "all",
      lastFetchParams: null
    });
  }
}));

// Quote Requests List Store
interface QuoteRequestListItem {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    address: string;
    phone: number;
  };
  product: {
    _id: string;
    productName: string;
    createdBy: {
      _id: string;
      firstName: string;
      lastName: string;
      company: string;
      email: string;
    };
  };
  quantity: number;
  uom: string;
  grade: {
    _id: string;
    name: string;
  };
  incoterm?: {
    _id: string;
    name: string;
  } | null;
  postCode?: string;
  city?: string;
  country: string;
  destination: string;
  packagingType?: {
    _id: string;
    name: string;
  };
  packaging_size: string;
  expected_annual_volume: number;
  delivery_date: string;
  application: string;
  pricing?: string;
  message: string;
  request_document?: string;
  open_request: boolean;
  status: "pending" | "responded" | "approved" | "rejected" | "cancelled";
  createdAt: string;
  updatedAt: string;
  __v?: number;
  statusMessage?: Array<{
    status: string;
    message: string;
    date: string;
    _id: string;
  }>;
  responseMessage?: Array<{
    status: string;
    response: string;
    date: string;
    _id: string;
  }>;
}

interface QuoteRequestsListStore {
  requests: QuoteRequestListItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalRequests: number;
  pageSize: number;
  searchTerm: string;
  statusFilter: string;
  lastFetchParams: string | null; // To prevent duplicate calls
  
  // Actions
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setCurrentPage: (page: number) => void;
  fetchQuoteRequests: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    forceRefresh?: boolean;
  }) => Promise<void>;
  clearFilters: () => void;
  reset: () => void;
}

export const useQuoteRequestsListStore = create<QuoteRequestsListStore>((set, get) => ({
  requests: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalRequests: 0,
  pageSize: 10,
  searchTerm: "",
  statusFilter: "",
  lastFetchParams: null,

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status });
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
  },

  fetchQuoteRequests: async (params = {}) => {
    const state = get();
    
    // Build actual params
    const actualParams = {
      page: params.page ?? state.currentPage,
      limit: params.limit ?? state.pageSize,
      ...(params.search && { search: params.search }),
      ...(params.status && { status: params.status })
    };

    // Create a cache key to prevent duplicate calls
    const cacheKey = JSON.stringify(actualParams);
    
    // If we already fetched with these exact params and it's not a forced refresh, skip
    // Also check if we're currently loading to prevent race conditions
    if ((state.lastFetchParams === cacheKey && !params.forceRefresh) || state.loading) {
      console.log("🔄 Skipping duplicate/concurrent API call for quote requests with params:", actualParams);
      return;
    }

    try {
      set({ loading: true, error: null, lastFetchParams: cacheKey });
      console.log("🔍 Fetching quote requests from store with params:", actualParams);
      
      const { getUserQuoteRequests } = await import("@/apiServices/user");
      const response = await getUserQuoteRequests(actualParams);

      if (response && response.data && Array.isArray(response.data)) {
        const pagination = response.meta?.pagination;
        
        set({
          requests: response.data,
          totalRequests: pagination?.total || response.total || response.data.length,
          totalPages: pagination?.totalPages || Math.ceil((response.total || response.data.length) / actualParams.limit),
          currentPage: actualParams.page,
          loading: false,
          error: null
        });
      } else {
        set({
          requests: [],
          totalRequests: 0,
          totalPages: 1,
          loading: false,
          error: null
        });
      }
    } catch (error) {
      console.error("Error fetching quote requests:", error);
      set({
        requests: [],
        totalRequests: 0,
        totalPages: 1,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch quote requests",
        lastFetchParams: null // Reset cache on error
      });
    }
  },

  clearFilters: () => {
    set({
      searchTerm: "",
      statusFilter: "",
      currentPage: 1,
      lastFetchParams: null
    });
  },

  reset: () => {
    set({
      requests: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalRequests: 0,
      searchTerm: "",
      statusFilter: "",
      lastFetchParams: null
    });
  }
}));
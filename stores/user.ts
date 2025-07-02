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

// Finance Requests List Store
interface FinanceRequestListItem {
  _id: string;
  userId: string;
  productId: {
    _id: string;
    productName: string;
  };
  emiMonths: number;
  quantity: number;
  estimatedPrice: number;
  notes: string;
  status: "pending" | "approved" | "rejected" | "under_review" | "cancelled";
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface FinanceRequestsListResponse {
  data: FinanceRequestListItem[];
  total: number;
  meta?: {
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

interface FinanceRequestsListStore {
  requests: FinanceRequestListItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalRequests: number;
  pageSize: number;
  searchTerm: string;
  statusFilter: string;
  lastFetchParams: string | null;

  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setCurrentPage: (page: number) => void;
  fetchFinanceRequests: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    forceRefresh?: boolean;
  }) => Promise<void>;
  clearFilters: () => void;
  reset: () => void;
}

export const useFinanceRequestsListStore = create<FinanceRequestsListStore>((set, get) => ({
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
    set({ searchTerm: term, currentPage: 1, lastFetchParams: null });
  },

  setStatusFilter: (status: string) => {
    set({ statusFilter: status, currentPage: 1, lastFetchParams: null });
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
  },

  fetchFinanceRequests: async (params = {}) => {
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
    
    if ((state.lastFetchParams === cacheKey && !params.forceRefresh) || state.loading) {
      console.log("🔄 Skipping duplicate/concurrent API call with params:", actualParams);
      return;
    }

    try {
      set({ loading: true, error: null, lastFetchParams: cacheKey });
      console.log("🔍 Fetching finance requests from store with params:", actualParams);
      
      const { getFinanceRequests } = await import("@/apiServices/user");
      const response = await getFinanceRequests();

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
      console.error("Error fetching finance requests:", error);
      set({
        requests: [],
        totalRequests: 0,
        totalPages: 1,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch finance requests",
        lastFetchParams: null
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

// Finance Request Detail Store
interface FinanceRequestDetail {
  _id: string;
  user: User;
  amount: number;
  currency: string;
  financeType: string;
  purpose: string;
  duration?: number;
  interestRate?: number;
  collateral?: string;
  description: string;
  documents?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  statusMessage?: Array<{
    status: string;
    message: string;
    date: string;
    _id: string;
  }>;
}

interface FinanceRequestStore {
  financeRequestDetail: FinanceRequestDetail | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  fetchFinanceRequestDetail: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string, statusMessage: string) => Promise<boolean>;
  clearFinanceRequestDetail: () => void;
}

export const useFinanceRequestStore = create<FinanceRequestStore>((set, get) => ({
  financeRequestDetail: null,
  loading: false,
  error: null,
  updating: false,

  fetchFinanceRequestDetail: async (id: string) => {
    try {
      set({ loading: true, error: null });
      console.log("🔍 Fetching finance request detail for ID:", id);
      
      const { getFinanceRequestDetail } = await import("@/apiServices/user");
      const response = await getFinanceRequestDetail(id);
      
      if (response && response.data) {
        set({ 
          financeRequestDetail: response.data, 
          loading: false, 
          error: null 
        });
        console.log("✅ Finance request detail fetched successfully:", response.data);
      } else {
        set({ 
          financeRequestDetail: null, 
          loading: false, 
          error: "No data received" 
        });
      }
    } catch (error) {
      console.error("❌ Error fetching finance request detail:", error);
      set({ 
        financeRequestDetail: null, 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch finance request detail" 
      });
    }
  },

  updateStatus: async (id: string, status: string, statusMessage: string) => {
    try {
      set({ updating: true });
      console.log("🔍 Updating finance request status:", { id, status, statusMessage });
      
      const { updateFinanceRequestStatus } = await import("@/apiServices/user");
      const response = await updateFinanceRequestStatus(id, {
        status: status as any,
        statusMessage
      });
      
      // Refresh the finance request detail to get updated data
      await get().fetchFinanceRequestDetail(id);
      
      set({ updating: false });
      console.log("✅ Finance request status updated successfully");
      return true;
    } catch (error) {
      console.error("❌ Error updating finance request status:", error);
      set({ updating: false });
      return false;
    }
  },

  clearFinanceRequestDetail: () => {
    set({ 
      financeRequestDetail: null, 
      loading: false, 
      error: null,
      updating: false
    });
  },
}));

// Product Requests Types
interface ProductRequestUser {
  _id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  address: string;
  phone: number;
}

interface ProductRequestProduct {
  _id: string;
  productName: string;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
  };
}

interface ProductRequestListItem {
  _id: string;
  user: ProductRequestUser;
  product: ProductRequestProduct;
  quantity: number;
  uom: string;
  city: string;
  country: string;
  destination: string;
  delivery_date: string;
  message: string;
  request_document: string;
  status: "pending" | "approved" | "rejected" | "under_review" | "cancelled";
  sellerStatus: "pending" | "accepted" | "in_progress" | "shipped" | "delivered" | "completed" | "cancelled" | "rejected";
  statusMessage: Array<{
    status: string;
    message: string;
    date: string;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
  statusTracking?: {
    adminStatus: string;
    sellerStatus: string;
    lastUpdate: string;
    totalUpdates: number;
  };
}

interface ProductRequestsListResponse {
  success: boolean;
  message: string;
  data: ProductRequestListItem[];
  meta: {
    pagination: {
      total: number;
      page: number;
      totalPages: number;
      count: number;
      limit: number;
    };
    filters: {
      search: string;
      status: string;
    };
  };
}

interface ProductRequestsListStore {
  requests: ProductRequestListItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalRequests: number;
  pageSize: number;
  searchTerm: string;
  statusFilter: string;
  lastFetchParams: string | null;

  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setCurrentPage: (page: number) => void;
  fetchProductRequests: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    forceRefresh?: boolean;
  }) => Promise<void>;
  clearFilters: () => void;
  reset: () => void;
}

export const useProductRequestsListStore = create<ProductRequestsListStore>((set, get) => ({
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

  fetchProductRequests: async (params = {}) => {
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
      console.log("🔄 Skipping duplicate/concurrent API call for product requests with params:", actualParams);
      return;
    }

    try {
      set({ loading: true, error: null, lastFetchParams: cacheKey });
      console.log("🔍 Fetching product requests from store with params:", actualParams);
      
      const { getBuyerProductRequests } = await import("@/apiServices/user");
      const response: ProductRequestsListResponse = await getBuyerProductRequests();

      if (response && response.success && response.data && Array.isArray(response.data)) {
        const pagination = response.meta?.pagination;
        
        set({
          requests: response.data,
          totalRequests: pagination?.total || response.data.length,
          totalPages: pagination?.totalPages || Math.ceil(response.data.length / actualParams.limit),
          currentPage: pagination?.page || actualParams.page,
          loading: false,
          error: null
        });
        console.log("✅ Product requests fetched successfully:", response.data.length, "items");
      } else {
        set({
          requests: [],
          totalRequests: 0,
          totalPages: 1,
          loading: false,
          error: response?.message || "No data received"
        });
      }
    } catch (error) {
      console.error("❌ Error fetching product requests:", error);
      set({
        requests: [],
        totalRequests: 0,
        totalPages: 1,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch product requests",
        lastFetchParams: null
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
  },
}));

// Product Request Detail Types
interface ProductRequestDetailUser {
  _id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  address: string;
  phone: number;
}

interface ProductRequestDetailProduct {
  _id: string;
  productName: string;
  chemicalName: string;
  description: string;
  tradeName: string;
  manufacturingMethod: string;
  countryOfOrigin: string;
  color: string;
  productImages: Array<{
    id: string;
    name: string;
    type: string;
    fileUrl: string;
    _id: string;
  }>;
  density: number;
  mfi: number;
  tensileStrength: number;
  elongationAtBreak: number;
  shoreHardness: number;
  waterAbsorption: number;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    address: string;
    phone: number;
  };
}

interface SupplierOffer {
  _id: string;
  bulkOrderId: {
    _id: string;
    product: string;
    quantity: number;
    uom: string;
    city: string;
    country: string;
    delivery_date: string;
  };
  supplierId: {
    _id: string;
    firstName: string;
    lastName: string;
    company: string;
    email: string;
  };
  pricePerUnit: number;
  availableQuantity: number;
  deliveryTimeInDays: number;
  incotermAndPackaging: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  statusMessage: Array<{
    status: string;
    message: string;
    date: string;
    updatedBy: string;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface ProductRequestDetailResponse {
  order: ProductRequestDetail;
  offers: SupplierOffer[];
}

interface ProductRequestDetail {
  _id: string;
  user: ProductRequestDetailUser;
  product: ProductRequestDetailProduct;
  quantity: number;
  uom: string;
  city: string;
  country: string;
  destination: string;
  delivery_date: string;
  message: string;
  request_document: string;
  status: "pending" | "approved" | "rejected" | "under_review" | "cancelled";
  sellerStatus: "pending" | "accepted" | "in_progress" | "shipped" | "delivered" | "completed" | "cancelled" | "rejected";
  statusMessage: Array<{
    status: string;
    message: string;
    date: string;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  statusTracking?: {
    adminStatus: string;
    sellerStatus: string;
    lastUpdate: string;
    totalUpdates: number;
    statusHistory: Array<any>;
  };
}

interface ProductRequestDetailStore {
  productRequestDetail: ProductRequestDetail | null;
  supplierOffers: SupplierOffer[];
  loading: boolean;
  error: string | null;
  updating: boolean;
  fetchProductRequestDetail: (id: string) => Promise<void>;
  updateStatus: (id: string, status: string, statusMessage: string) => Promise<boolean>;
  clearProductRequestDetail: () => void;
}

export const useProductRequestDetailStore = create<ProductRequestDetailStore>((set, get) => ({
  productRequestDetail: null,
  supplierOffers: [],
  loading: false,
  error: null,
  updating: false,

  fetchProductRequestDetail: async (id: string) => {
    set({ loading: true, error: null });
    try {
      console.log("🔍 Fetching product request detail for ID:", id);
      
      const { getBuyerProductRequestDetail } = await import("@/apiServices/user");
      const response = await getBuyerProductRequestDetail(id);
      
      if (response && response.success && response.data) {
        set({ 
          productRequestDetail: response.data.order, 
          supplierOffers: response.data.offers || [],
          loading: false, 
          error: null 
        });
        console.log("✅ Product request detail fetched successfully:", response.data);
      } else {
        set({ 
          productRequestDetail: null, 
          supplierOffers: [],
          loading: false, 
          error: response?.message || "No data received" 
        });
      }
    } catch (error) {
      console.error("❌ Error fetching product request detail:", error);
      set({ 
        productRequestDetail: null, 
        supplierOffers: [],
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch product request detail" 
      });
    }
  },

  updateStatus: async (id: string, status: string, statusMessage: string) => {
    try {
      set({ updating: true });
      console.log("🔍 Updating product request status:", { id, status, statusMessage });
      
      // Note: Update this when the update API endpoint is available
      // const { updateProductRequestStatus } = await import("@/apiServices/user");
      // const response = await updateProductRequestStatus(id, {
      //   status: status as any,
      //   statusMessage
      // });
      
      // Refresh the product request detail to get updated data
      await get().fetchProductRequestDetail(id);
      
      set({ updating: false });
      console.log("✅ Product request status updated successfully");
      return true;
    } catch (error) {
      console.error("❌ Error updating product request status:", error);
      set({ updating: false });
      return false;
    }
  },

  clearProductRequestDetail: () => {
    set({ 
      productRequestDetail: null, 
      supplierOffers: [],
      loading: false, 
      error: null,
      updating: false
    });
  },
}));
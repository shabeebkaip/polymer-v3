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
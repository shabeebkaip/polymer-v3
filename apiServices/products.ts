import axiosInstance from "@/lib/axiosInstance";

// Define the query type
export interface ProductQuery {
  search?: string;
  chemicalFamily?: string[];
  polymerType?: string[];
  industry?: string[];
  grade?: string[];
  physicalForm?: string[];
  countryOfOrigin?: string[];
  uom?: string[];
  priceTerms?: string;
  incoterms?: string[];
  paymentTerms?: string[];
  packagingType?: string[];
  recyclable?: boolean;
  bioDegradable?: boolean;
  fdaApproved?: boolean;
  medicalGrade?: boolean;
  createdBy?: string[];
  page?: number;
  limit?: number;
}

// API function using the defined type
export const getProductList = async (query: ProductQuery) => {
  try {
    const response = await axiosInstance.post("product/list", query);
    return response.data;
  } catch (error) {
    console.error("Error fetching product list:", error);
    throw error;
  }
};

export const getProductFilters = async () => {
  try {
    const response = await axiosInstance.get("product/filter");
    return response.data;
  } catch (error) {
    console.error("Error fetching product filters:", error);
    throw error;
  }
};

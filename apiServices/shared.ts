import axiosInstance from "@/lib/axiosInstance";
import { UploadedFile } from "@/types/shared";

// 🛠️ Reusable function for dropdown API calls with timeout handling
const fetchDropdownData = async (endpoint: string, entityName: string) => {
  try {
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching ${entityName}:`, {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      timeout: error.code === 'ECONNABORTED'
    });
    
    // Return empty array as fallback for timeout errors to prevent UI crashes
    if (error.code === 'ECONNABORTED') {
      console.warn(`${entityName} API timed out, returning empty array`);
      return { data: [], success: false, message: "Request timed out" };
    }
    
    throw error;
  }
};

// ✅ SSR-friendly API using fetch with revalidate
export const getIndustryList = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/industry/list`,
    {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch industry list");
  return res.json();
};

export const getProductFamilies = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/product-family/list`,
    {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch product families");
  return res.json();
};

export const getSellers = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/seller/list`,
    {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch sellers");
  return res.json();
};

// ✅ These remain client-side (no need to switch)
export const getGrades = async () => {
  return fetchDropdownData("/grade/list", "grades");
};

export const getIncoterms = async () => {
  return fetchDropdownData("/incoterm/list", "incoterms");
};

export const getPackagingTypes = async () => {
  return fetchDropdownData("/packaging-type/list", "packaging types");
};

export const getChemicalFamilies = async () => {
  return fetchDropdownData("/chemical-family/list", "chemical families");
};

export const getPolymersType = async () => {
  return fetchDropdownData("/polymer-type/list", "polymer types");
};

export const getPhysicalForms = async () => {
  return fetchDropdownData("/physical-form/list", "physical forms");
};

export const getPaymentTerms = async () => {
  return fetchDropdownData("/payment-terms/list", "payment terms");
};

export const postFileUpload = async (data: FormData): Promise<UploadedFile> => {
  try {
    const response = await axiosInstance.post<{
      fileUrl: string;
      id: string;
      originalFilename: string;
      format: string;
      resourceType: string;
      viewUrl?: string;  // Only for raw files
      downloadUrl?: string;
    }>(
      "/file/upload",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    // Map backend response to match UploadedFile interface
    return {
      fileUrl: response.data.fileUrl,
      id: response.data.id,
      name: response.data.originalFilename,  // Map for backward compatibility
      type: response.data.format,  // Map format to type
      originalFilename: response.data.originalFilename,
      format: response.data.format,
      resourceType: response.data.resourceType,
      viewUrl: response.data.viewUrl,  // Relative URL for inline preview
      downloadUrl: response.data.downloadUrl,  // URL for forced downloads
    };
  } catch (error) {
    console.error("Error uploading:", error);
    throw error;
  }
};

export const imageUpload = async (data: FormData): Promise<UploadedFile> => {
  const response = await axiosInstance.post<{ fileUrl: string; id: string }>(
    "/file/upload",
    data,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response.data;
};

export const getSellerDetail = async (sellerId: string) => {
  try {
    const response = await axiosInstance.get(`/user/seller/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching seller detail:", error);
    throw error;
  }
};

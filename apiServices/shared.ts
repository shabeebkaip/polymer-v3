import axiosInstance from "@/lib/axiosInstance";


export interface UploadedFile {
  id: string;
  fileUrl: string;
  type?: string;
  name?: string;
}

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
  try {
    const response = await axiosInstance.get("/grade/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching grades:", error);
    throw error;
  }
};

export const getIncoterms = async () => {
  try {
    const response = await axiosInstance.get("/incoterm/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching incoterms:", error);
    throw error;
  }
};

export const getPackagingTypes = async () => {
  try {
    const response = await axiosInstance.get("/packaging-type/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching packaging types:", error);
    throw error;
  }
};

export const getChemicalFamilies = async () => {
  try {
    const response = await axiosInstance.get("/chemical-family/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching chemical families:", error);
    throw error;
  }
};

export const getPolymersType = async () => {
  try {
    const response = await axiosInstance.get("/polymer-type/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching polymers type:", error);
    throw error;
  }
};

export const getPhysicalForms = async () => {
  try {
    const response = await axiosInstance.get("/physical-form/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching physical forms:", error);
    throw error;
  }
};

export const getPaymentTerms = async () => {
  try {
    const response = await axiosInstance.get("/payment-terms/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching payment terms:", error);
    throw error;
  }
};

export const postFileUpload = async (data: FormData): Promise<UploadedFile> => {
  try {
    const response = await axiosInstance.post<{ fileUrl: string; id: string }>(
      "/file/upload",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
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

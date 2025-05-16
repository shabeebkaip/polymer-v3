import axiosInstance from "@/lib/axiosInstance";

export const getIndustryList = async () => {
  try {
    const response = await axiosInstance.get("industry/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching industry list:", error);
    throw error;
  }
};

export const getProductFamilies = async () => {
  try {
    const response = await axiosInstance.get("product-family/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching product families:", error);
    throw error;
  }
};

export const getSellers = async () => {
  try {
    const response = await axiosInstance.get("user/seller/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching sellers:", error);
    throw error;
  }
};

export const getGrades = async () => {
  try {
    const response = await axiosInstance.get("grade/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching grades:", error);
    throw error;
  }
};

export const getIncoterms = async () => {
  try {
    const response = await axiosInstance.get("incoterm/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching incoterms:", error);
    throw error;
  }
};

export const getPackagingTypes = async () => {
  try {
    const response = await axiosInstance.get("packaging-type/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching packaging types:", error);
    throw error;
  }
};

export const getChemicalFamilies = async () => {
  try {
    const response = await axiosInstance.get("chemical-family/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching chemical families:", error);
    throw error;
  }
};

export const getPolymersType = async () => {
  try {
    const response = await axiosInstance.get("polymer-type/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching polymers type:", error);
    throw error;
  }
};

export const getPhysicalForms = async () => {
  try {
    const response = await axiosInstance.get("physical-form/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching physical forms:", error);
    throw error;
  }
};
export const getPaymentTerms = async () => {
  try {
    const response = await axiosInstance.get("payment-terms/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching payment terms:", error);
    throw error;
  }
};

export const postFileUpload = async (data) => {
  try {
    const response = await axiosInstance.post(`/file/upload`, data);
    return response;
  } catch (error) {
    console.error("Error uploading :", error);
    throw error;
  }
};

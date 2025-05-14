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

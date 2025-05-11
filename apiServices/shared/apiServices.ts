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

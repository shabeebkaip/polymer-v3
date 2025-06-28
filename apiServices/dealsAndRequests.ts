import axiosInstance from "@/lib/axiosInstance";

export const getBuyerOpportunities = async () => {
  try {
    const response = await axiosInstance.get("/bulk-order/admin-approved");
    // Handle different response structures
    if (response.data?.data) {
      return { data: response.data.data };
    } else if (Array.isArray(response.data)) {
      return { data: response.data };
    } else {
      return { data: [] };
    }
  } catch (error) {
    console.error("Error fetching buyer opportunities:", error);
    // Return empty data instead of throwing error to prevent chunk loading issues
    return { data: [] };
  }
};

export const getSuppliersSpecialDeals = async () => {
  try {
    const response = await axiosInstance.get("/best-deal/admin-approved");
    // Handle different response structures
    if (response.data?.data) {
      return { data: response.data.data };
    } else if (Array.isArray(response.data)) {
      return { data: response.data };
    } else {
      return { data: [] };
    }
  } catch (error) {
    console.error("Error fetching suppliers special deals:", error);
    // Return empty data instead of throwing error to prevent chunk loading issues
    return { data: [] };
  }
};

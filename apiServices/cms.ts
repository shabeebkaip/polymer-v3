import axiosInstance from "@/lib/axiosInstance";

export const getBenefitsOfBuyers = async () => {
  try {
    const response = await axiosInstance.get("/cms/list/BenefitsForBuyer");
    return response.data;
  } catch (error) {
    console.error("Error fetching benefits of buyers:", error);
    throw error;
  }
};

export const getBenefitsOfSuppliers = async () => {
  try {
    const response = await axiosInstance.get("/cms/list/BenefitsForSuplier");
    return response.data;
  } catch (error) {
    console.error("Error fetching benefits of suppliers:", error);
    throw error;
  }
};

export const getSocialLinks = async () => {
  try {
    const response = await axiosInstance.get("/cms/list/socialMedia");
    return response.data;
  } catch (error) {
    console.error("Error fetching social links:", error);
    throw error;
  }
};

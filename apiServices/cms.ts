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

export const getHeroSection = async () => {
  try {
    const response = await axiosInstance.get("/cms/list/HeroSection");
    return response.data;
  } catch (error) {
    console.error("Error fetching hero section:", error);
    throw error;
  }
};

export const getPolymerAdvantages = async () => {
  try {
    const response = await axiosInstance.get("/cms/list/PolymerAdvantages");
    return response.data;
  } catch (error) {
    console.error("Error fetching polymer advantages:", error);
    throw error;
  }
};

export const getHomeSections = async () => {
  try {
    const response = await axiosInstance.get("/cms/list/HomeSections");
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    console.error("Error fetching home sections:", error);
    throw error;
  }
};

import axiosInstance from "@/lib/axiosInstance";

export const createQuoteRequest = async (data: any) => {
  try {
    const response = await axiosInstance.post("/quote-request/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating quote request:", error);
    throw error;
  }
};

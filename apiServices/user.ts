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

export const createSampleRequest = async (data: any) => {
  try {
    const response = await axiosInstance.post("/sample-request/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating sample request:", error);
    throw error;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get("/user/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

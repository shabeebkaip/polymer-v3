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

export const createFinanceRequest = async (data: any) => {
  try {
    const response = await axiosInstance.post("/finance/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating finance request:", error);
    throw error;
  }
}

export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get("/user/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const getUserQuoteRequests = async () => {
  try {
    const response = await axiosInstance.get("/quote-request/history");
    return response.data;
  } catch (error) {
    console.error("Error fetching user quote requests:", error);
    throw error;
  }
};

export const getUserSampleRequests = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    
    const url = `/sample-request/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching user sample requests:", error);
    throw error;
  }
};

export const getUserSampleEnquiries = async () => {
  try {
    const response = await axiosInstance.get("/sample-request/received");
    return response.data;
  } catch (error) {
    console.error("Error fetching user sample enquiries:", error);
    throw error;
  }
};

export const getUserQuoteEnquiries = async () => {
  try {
    const response = await axiosInstance.get("/quote-request/received");
    return response.data;
  } catch (error) {
    console.error("Error fetching user quote enquiries:", error);
    throw error;
  }
};

export const getSidebarList = async () => {
  try {
    const response = await axiosInstance.get("/auth/side-bar");
    return response.data;
  } catch (error) {
    console.error("Error fetching sidebar list:", error);
    throw error;
  }
}  
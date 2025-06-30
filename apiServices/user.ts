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

export const getUserQuoteRequests = async (params?: {
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
    
    const url = `/quote-request/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await axiosInstance.get(url);
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

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);

    const url = `/sample-request/history${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
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
};

export const getSampleRequestDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/sample-request/history/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sample request detail:", error);
    throw error;
  }
};

export const updateSampleRequestStatus = async (
  id: string,
  data: {
    status:
      | "pending"
      | "responded"
      | "sent"
      | "delivered"
      | "approved"
      | "rejected"
      | "cancelled";
    statusMessage: string;
  }
) => {
  try {
    console.log("🔍 Updating sample request status:", { id, data });
    const response = await axiosInstance.patch(
      `/sample-request/status/${id}`,
      data
    );
    console.log("✅ Sample request status updated successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error updating sample request status:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request was made but no response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};

export const getQuoteRequestDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/quote-request/history/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching quote request detail:", error);
    throw error;
  }
};

// Debug function to test API connectivity
export const testApiConnectivity = async () => {
  try {
    console.log("🔍 Testing API connectivity...");
    const response = await axiosInstance.get("/user/profile");
    console.log("✅ API connectivity test successful:", response.status);
    return { success: true, status: response.status };
  } catch (error: any) {
    console.error("❌ API connectivity test failed:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    } else if (error.request) {
      console.error("Request was made but no response received");
    } else {
      console.error("Error setting up request:", error.message);
    }
    return { success: false, error };
  }
};

export const updateQuoteRequestStatus = async (id: string, data: {
  status: "pending" | "responded" | "negotiation" | "approved" | "rejected" | "cancelled" | "fulfilled";
  statusMessage: string;
}) => {
  try {
    console.log("🔍 Updating quote request status:", { id, data });
    const response = await axiosInstance.patch(`/quote-request/status/${id}`, data);
    console.log("✅ Quote request status updated successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error updating quote request status:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request was made but no response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};

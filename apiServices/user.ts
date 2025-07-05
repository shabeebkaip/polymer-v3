import axiosInstance from "@/lib/axiosInstance";

// ============================================================================
// USER PROFILE & AUTHENTICATION
// ============================================================================

export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get("/user/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const editUserProfile = async (data: any) => {
  try {
    const response = await axiosInstance.put("/user/edit", data);
    return response.data;
  } catch (error) {
    console.error("Error editing user profile:", error);
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

// ============================================================================
// QUOTE REQUESTS (Buyer Side)
// ============================================================================

export const createQuoteRequest = async (data: any) => {
  try {
    const response = await axiosInstance.post("/quote-request/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating quote request:", error);
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

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);

    const url = `/quote-request/history${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching user quote requests:", error);
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

export const updateQuoteRequestStatus = async (
  id: string,
  data: {
    status:
      | "pending"
      | "responded"
      | "negotiation"
      | "approved"
      | "rejected"
      | "cancelled"
      | "fulfilled";
    statusMessage: string;
  }
) => {
  try {
    console.log("🔍 Updating quote request status:", { id, data });
    const response = await axiosInstance.patch(
      `/quote-request/status/${id}`,
      data
    );
    console.log("✅ Quote request status updated successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error updating quote request status:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error(
        "Request was made but no response received:",
        error.request
      );
    } else {
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};

// ============================================================================
// QUOTE ENQUIRIES (Seller Side)
// ============================================================================

export const getUserQuoteEnquiries = async (params?: any) => {
  try {
    const response = await axiosInstance.get("/quote-request/received", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching user quote enquiries:", error);
    throw error;
  }
};

export const getReceivedQuoteEnquiryDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/quote-request/received/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching received quote enquiry detail:", error);
    throw error;
  }
};
 export const updateQuoteEnquiryStatus = async (id: string, status: string, message?: string) => {
  try {
    const response = await axiosInstance.patch(`/quote-request/status/${id}`, {
      status,
      statusMessage: message || ""
    });
    return response.data;
  } catch (error) {
    console.error("Error updating quote enquiry status:", error);
    throw error;
  }
};

// ============================================================================
// SAMPLE REQUESTS (Buyer Side)
// ============================================================================

export const createSampleRequest = async (data: any) => {
  try {
    const response = await axiosInstance.post("/sample-request/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating sample request:", error);
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
    console.log(
      "✅ Sample request status updated successfully:",
      response.data
    );
    return response.data;
  } catch (error: any) {
    console.error("❌ Error updating sample request status:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error(
        "Request was made but no response received:",
        error.request
      );
    } else {
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};

// ============================================================================
// SAMPLE ENQUIRIES (Seller Side)
// ============================================================================

export const getUserSampleEnquiries = async (params?: {
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

    const url = `/sample-request/received${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching user sample enquiries:", error);
    throw error;
  }
};

export const getRecievedSampleEnquiryDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/sample-request/received/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching received sample enquiry detail:", error);
    throw error;
  }
};

export const updateSampleEnquiryStatus = async (id: string, status: string, message?: string) => {
  try {
    const response = await axiosInstance.put(`/sample-request/received/${id}/status`, {
      status,
      message
    });
    return response.data;
  } catch (error) {
    console.error("Error updating sample enquiry status:", error);
    throw error;
  }
};

// ============================================================================
// FINANCE REQUESTS
// ============================================================================

export const createFinanceRequest = async (data: any) => {
  try {
    const response = await axiosInstance.post("/finance/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating finance request:", error);
    throw error;
  }
};

export const getFinanceRequests = async () => {
  try {
    const response = await axiosInstance.get("/finance/history");
    return response.data;
  } catch (error) {
    console.error("Error fetching finance requests:", error);
    throw error;
  }
};

export const getFinanceRequestDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/finance/history/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching finance request detail:", error);
    throw error;
  }
};

export const updateFinanceRequestStatus = async (
  id: string,
  data: {
    status: "pending" | "approved" | "rejected" | "under_review" | "cancelled";
    statusMessage: string;
  }
) => {
  try {
    console.log("🔍 Updating finance request status:", { id, data });
    const response = await axiosInstance.patch(`/finance/status/${id}`, data);
    console.log(
      "✅ Finance request status updated successfully:",
      response.data
    );
    return response.data;
  } catch (error: any) {
    console.error("❌ Error updating finance request status:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error(
        "Request was made but no response received:",
        error.request
      );
    } else {
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};

// Note: Keeping this for backward compatibility - same as getFinanceRequestDetail
export const getFinanceDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/finance/history/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching finance details:", error);
    throw error;
  }
};

// ============================================================================
// PRODUCT REQUESTS (Bulk Orders)
// ============================================================================

export const createBuyerProductRequest = async (data: any) => {
  try {
    const response = await axiosInstance.post("/bulk-order/create", data);
    return response.data;
  } catch (error) {
    console.error("Error creating buyer product request:", error);
    throw error;
  }
};

export const getBuyerProductRequests = async () => {
  try {
    const response = await axiosInstance.get("/bulk-order/user-list");
    return response.data;
  } catch (error) {
    console.error("Error fetching buyer product requests:", error);
    throw error;
  }
};

export const getBuyerProductRequestDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/bulk-order/user-list/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching buyer product request detail:", error);
    throw error;
  }
};

// ==========================================================================
// SELLER SUBMITTED OFFERS
// ==========================================================================

export const getSellerSubmittedOffers = async () => {
  try {
    const response = await axiosInstance.get("/bulk-order/supplier-offer/history");
    return response.data;
  } catch (error) {
    console.error("Error fetching seller submitted offers:", error);
    throw error;
  }
}

export const getSellerSubmittedOfferDetail = async (bulkOrderId: string) => {
  try {
    const response = await axiosInstance.get(`/bulk-order/supplier-offer/history/${bulkOrderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching seller submitted offer detail:", error);
    throw error;
  }
}

export const sellerSubmitOffer = async ( data: any) => {
  try {
   
    const response = await axiosInstance.post(`/bulk-order/supplier-offer/create`, data);
    console.log("✅ Offer submitted successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error submitting offer:", error);
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
}

// ============================================================================
// PROMOTIONS & DISCOUNTS
// ============================================================================

export const getCreatedPromotionsForSeller = async () => {
  try {
    const response = await axiosInstance.get("/best-deal/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching created promotions for seller:", error);
    throw error;
  }
}

// ============================================================================
// UTILITY & DEBUG FUNCTIONS
// ============================================================================

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

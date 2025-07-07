import axiosInstance from '@/lib/axiosInstance';

export interface ProductChatMessage {
  _id: string;
  message: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  senderCompany: string;
  senderImage: string;
  productId: string;
  messageType: 'text';
  isRead: boolean;
  createdAt: string;
}

export interface SellerInfo {
  _id: string;
  name: string;
  company: string;
  email: string;
  profile_image?: string;
}

export interface ProductInfo {
  _id: string;
  productName: string;
  chemicalName?: string;
  description?: string;
}

export interface ProductChatResponse {
  success: boolean;
  message: string;
  data: {
    messages: ProductChatMessage[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface SellerInfoResponse {
  success: boolean;
  message: string;
  data: {
    seller: SellerInfo;
    product: ProductInfo;
  };
}

export interface ConversationItem {
  productId: string;
  productName: string;
  sellerId: string;
  sellerName: string;
  sellerCompany: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// Buyer endpoints for product chat
export const getSellerInfoForProduct = async (productId: string): Promise<SellerInfoResponse> => {
  const response = await axiosInstance.get(`/chat/product/seller-info/${productId}`);
  return response.data;
};

export const getProductChatMessages = async (
  productId: string, 
  page: number = 1, 
  limit: number = 50
): Promise<ProductChatResponse> => {
  const response = await axiosInstance.get(
    `/chat/product/messages/${productId}?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const sendProductMessage = async (
  productId: string, 
  message: string
): Promise<{ success: boolean; message: string; data: ProductChatMessage }> => {
  const response = await axiosInstance.post(`/chat/product/send-message/${productId}`, {
    message
  });
  return response.data;
};

export const getProductConversations = async (): Promise<{
  success: boolean;
  data: ConversationItem[];
}> => {
  const response = await axiosInstance.get('/chat/product/conversations');
  return response.data;
};

// Seller endpoints (for future use)
export const getSellerProductConversations = async (): Promise<{
  success: boolean;
  data: ConversationItem[];
}> => {
  const response = await axiosInstance.get('/chat/seller-product/conversations');
  return response.data;
};

export const getSellerProductMessages = async (
  productId: string,
  buyerId: string,
  page: number = 1,
  limit: number = 50
): Promise<ProductChatResponse> => {
  const response = await axiosInstance.get(
    `/chat/seller-product/messages/${productId}/${buyerId}?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const sendSellerProductMessage = async (
  productId: string,
  buyerId: string,
  message: string
): Promise<{ success: boolean; message: string; data: ProductChatMessage }> => {
  const response = await axiosInstance.post(`/chat/seller-product/send-message/${productId}/${buyerId}`, {
    message
  });
  return response.data;
};

// Note: These API endpoints need to be implemented on the backend
// For now, we'll use getProductConversations to calculate unread count

// TODO: Implement these endpoints on the backend:
// GET /api/chat/unread-count - Get current unread count  
// POST /api/chat/mark-read - Mark messages as read

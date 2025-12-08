import axiosInstance from '@/lib/axiosInstance';

export type CommentType = 'deal-quote' | 'product-quote' | 'sample-request';

interface GenericComment {
  _id: string;
  quoteRequestId: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
    name?: string;
  };
  userRole?: 'buyer' | 'seller' | 'admin';
  comment: string;
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedAt?: string;
  }>;
  isDeleted: boolean;
  isEdited?: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface GenericCommentsPaginationResponse {
  success: boolean;
  data: GenericComment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface GenericCommentResponse {
  success: boolean;
  message: string;
  data: GenericComment;
}

interface AddCommentRequest {
  comment: string;
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
  }>;
}

interface UpdateCommentRequest {
  comment: string;
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
  }>;
}

const getBaseUrl = (type: CommentType): string => {
  if (type === 'deal-quote') return '/deal-quote-comment';
  if (type === 'sample-request') return '/sample-request-comment';
  return '/quote/product-quotes/comments';
};

export const genericCommentService = {
  /**
   * Add a new comment
   */
  addComment: async (
    type: CommentType,
    quoteRequestId: string,
    data: AddCommentRequest
  ): Promise<GenericCommentResponse> => {
    const baseUrl = getBaseUrl(type);
    const url = (type === 'deal-quote' || type === 'sample-request')
      ? `${baseUrl}/${quoteRequestId}`
      : baseUrl;
    
    const payload = (type === 'deal-quote' || type === 'sample-request')
      ? data 
      : { quoteRequestId, ...data };

    const response = await axiosInstance.post(url, payload);
    return response.data;
  },

  /**
   * Get all comments with pagination
   */
  getComments: async (
    type: CommentType,
    quoteRequestId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<GenericCommentsPaginationResponse> => {
    const baseUrl = getBaseUrl(type);
    const url = type === 'deal-quote'
      ? `${baseUrl}/${quoteRequestId}`
      : `${baseUrl}/${quoteRequestId}`;

    const response = await axiosInstance.get(url, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Update an existing comment
   */
  updateComment: async (
    type: CommentType,
    commentId: string,
    data: UpdateCommentRequest
  ): Promise<GenericCommentResponse> => {
    const baseUrl = getBaseUrl(type);
    const url = (type === 'deal-quote' || type === 'sample-request')
      ? `${baseUrl}/update/${commentId}`
      : `${baseUrl}/${commentId}`;

    const method = (type === 'deal-quote' || type === 'sample-request') ? 'put' : 'patch';
    const response = await axiosInstance[method](url, data);
    return response.data;
  },

  /**
   * Delete a comment (soft delete)
   */
  deleteComment: async (
    type: CommentType,
    commentId: string
  ): Promise<{ success: boolean; message: string }> => {
    const baseUrl = getBaseUrl(type);
    const url = (type === 'deal-quote' || type === 'sample-request')
      ? `${baseUrl}/delete/${commentId}`
      : `${baseUrl}/${commentId}`;

    const response = await axiosInstance.delete(url);
    return response.data;
  },

  /**
   * Get comment count
   */
  getCommentCount: async (
    type: CommentType,
    quoteRequestId: string
  ): Promise<{ success: boolean; count: number }> => {
    const baseUrl = getBaseUrl(type);
    const url = `${baseUrl}/${quoteRequestId}/count`;

    const response = await axiosInstance.get(url);
    return response.data;
  },
};

export type { GenericComment, GenericCommentsPaginationResponse, GenericCommentResponse, AddCommentRequest, UpdateCommentRequest };

import axiosInstance from '@/lib/axiosInstance';
import type {
  DealQuoteComment,
  AddCommentRequest,
  UpdateCommentRequest,
  CommentsPaginationResponse,
  CommentCountResponse,
  CommentResponse,
} from '@/types/comment';

const COMMENT_BASE_URL = '/deal-quote-comment';

export const commentService = {
  /**
   * Add a new comment to a deal quote request
   */
  addComment: async (
    dealQuoteRequestId: string,
    data: AddCommentRequest
  ): Promise<CommentResponse> => {
    const response = await axiosInstance.post(
      `${COMMENT_BASE_URL}/${dealQuoteRequestId}`,
      data
    );
    return response.data;
  },

  /**
   * Get all comments for a deal quote request with pagination
   */
  getComments: async (
    dealQuoteRequestId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<CommentsPaginationResponse> => {
    const response = await axiosInstance.get(
      `${COMMENT_BASE_URL}/${dealQuoteRequestId}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  /**
   * Get comment count for a deal quote request
   */
  getCommentCount: async (
    dealQuoteRequestId: string
  ): Promise<CommentCountResponse> => {
    const response = await axiosInstance.get(
      `${COMMENT_BASE_URL}/${dealQuoteRequestId}/count`
    );
    return response.data;
  },

  /**
   * Update an existing comment
   */
  updateComment: async (
    commentId: string,
    data: UpdateCommentRequest
  ): Promise<CommentResponse> => {
    const response = await axiosInstance.put(
      `${COMMENT_BASE_URL}/update/${commentId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a comment (soft delete)
   */
  deleteComment: async (commentId: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.delete(
      `${COMMENT_BASE_URL}/delete/${commentId}`
    );
    return response.data;
  },
};

// Sample Request Comment Service
const SAMPLE_REQUEST_COMMENT_BASE_URL = '/sample-request-comment';

export const sampleRequestCommentService = {
  /**
   * Add a new comment to a sample request
   */
  addComment: async (
    sampleRequestId: string,
    data: AddCommentRequest
  ): Promise<CommentResponse> => {
    const response = await axiosInstance.post(
      `${SAMPLE_REQUEST_COMMENT_BASE_URL}/${sampleRequestId}`,
      data
    );
    return response.data;
  },

  /**
   * Get all comments for a sample request with pagination
   */
  getComments: async (
    sampleRequestId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<CommentsPaginationResponse> => {
    const response = await axiosInstance.get(
      `${SAMPLE_REQUEST_COMMENT_BASE_URL}/${sampleRequestId}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  /**
   * Get comment count for a sample request
   */
  getCommentCount: async (
    sampleRequestId: string
  ): Promise<CommentCountResponse> => {
    const response = await axiosInstance.get(
      `${SAMPLE_REQUEST_COMMENT_BASE_URL}/${sampleRequestId}/count`
    );
    return response.data;
  },

  /**
   * Update an existing comment
   */
  updateComment: async (
    commentId: string,
    data: UpdateCommentRequest
  ): Promise<CommentResponse> => {
    const response = await axiosInstance.put(
      `${SAMPLE_REQUEST_COMMENT_BASE_URL}/update/${commentId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a comment (soft delete)
   */
  deleteComment: async (commentId: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosInstance.delete(
      `${SAMPLE_REQUEST_COMMENT_BASE_URL}/delete/${commentId}`
    );
    return response.data;
  },
};

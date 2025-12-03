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

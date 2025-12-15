'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Loader2, AlertCircle, ChevronDown, RefreshCw } from 'lucide-react';
import { CommentInput } from '@/components/user/deal-quote-requests/CommentInput';
import { CommentItem } from '@/components/user/deal-quote-requests/CommentItem';
import { genericCommentService, type CommentType, type GenericComment } from '@/apiServices/genericComments';

interface GenericCommentSectionProps {
  quoteRequestId: string;
  currentUserId: string;
  commentType: CommentType;
  userRole?: 'buyer' | 'seller' | 'admin';
}

export const GenericCommentSection: React.FC<GenericCommentSectionProps> = ({
  quoteRequestId,
  currentUserId,
  commentType,
  userRole = 'buyer',
}) => {
  const [comments, setComments] = useState<GenericComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchComments = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      try {
        if (!append) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const response = await genericCommentService.getComments(
          commentType,
          quoteRequestId,
          pageNum,
          20
        );

        if (append) {
          setComments((prev) => [...prev, ...response.data]);
        } else {
          setComments(response.data);
        }

        setTotalComments(response.pagination.total);
        setHasMore(response.pagination.page < response.pagination.totalPages);
        setPage(pageNum);
        setError(null);
      } catch (err: unknown) {
        const errorMessage = err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data ? String(err.response.data.message) : 'Failed to load comments';
        setError(errorMessage);
        console.error('Failed to fetch comments:', err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    [commentType, quoteRequestId]
  );

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async (
    comment: string,
    attachments: { fileName?: string; name?: string; fileUrl?: string; fileType?: string; type?: string }[]
  ) => {
    try {
      // Transform attachments to match API format
      const transformedAttachments = attachments
        .filter(att => att.fileUrl) // Filter out attachments without fileUrl
        .map(att => {
          const fileName = att.fileName || att.name || att.fileUrl?.split('/').pop()?.split('?')[0] || 'Attachment';
          const fileType = att.fileType || att.type || 'application/octet-stream';
          
          return {
            fileName,
            fileUrl: att.fileUrl!,
            fileType,
          };
        });

      console.log('Sending attachments:', transformedAttachments);

      await genericCommentService.addComment(commentType, quoteRequestId, {
        comment,
        attachments: transformedAttachments.length > 0 ? transformedAttachments : undefined,
      });
      
      // Refresh comments to show the new one
      await fetchComments(1, false);
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data ? String(err.response.data.message) : 'Failed to add comment';
      throw new Error(errorMessage);
    }
  };

  const handleUpdateComment = async (commentId: string, newComment: string) => {
    try {
      const response = await genericCommentService.updateComment(commentType, commentId, {
        comment: newComment,
      });

      // Update the comment in the list
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? response.data : c))
      );
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data ? String(err.response.data.message) : 'Failed to update comment';
      throw new Error(errorMessage);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await genericCommentService.deleteComment(commentType, commentId);

      // Remove the comment from the list
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setTotalComments((prev) => prev - 1);
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data ? String(err.response.data.message) : 'Failed to delete comment';
      throw new Error(errorMessage);
    }
  };

  const handleLoadMore = () => {
    fetchComments(page + 1, true);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchComments(1, false);
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <MessageSquare className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
            <p className="text-sm text-gray-500">
              {totalComments} {totalComments === 1 ? 'comment' : 'comments'}
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh comments"
        >
          <RefreshCw
            className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Add Comment Input */}
        <CommentInput
          onSubmit={handleAddComment}
          placeholder="Share your thoughts, ask questions, or provide updates..."
          disabled={isLoading}
        />

        {/* Error State */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-sm text-gray-600">Loading comments...</p>
          </div>
        ) : !comments || comments.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No comments yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Be the first to comment on this request
            </p>
          </div>
        ) : (
          /* Comments List */
          <>
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                  onUpdate={handleUpdateComment}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading more...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Load more comments
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

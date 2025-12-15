'use client';

import React, { useState } from 'react';
import { Edit2, Trash2, Save, X, Paperclip, Download } from 'lucide-react';
import type { DealQuoteComment } from '@/types/comment';

interface CommentItemProps {
  comment: DealQuoteComment | { _id: string; quoteRequestId?: string; dealQuoteRequestId?: string; userId: unknown; userRole?: string; comment: string; attachments?: unknown[]; createdAt: string; updatedAt: string; isEdited?: boolean };
  currentUserId: string;
  isAdmin: boolean;
  onUpdate: (commentId: string, newComment: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  isAdmin,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.comment);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle both userId and user fields from API
  const userData = (comment as { user?: { _id?: string; firstName?: string; lastName?: string; role?: string; user_type?: string; name?: string; email?: string; companyName?: string; company?: string }; userId?: { _id?: string; firstName?: string; lastName?: string; role?: string; user_type?: string; name?: string; email?: string; companyName?: string; company?: string } }).user || (comment as { userId?: { _id?: string; firstName?: string; lastName?: string; role?: string; user_type?: string; name?: string; email?: string; companyName?: string; company?: string } }).userId;
  const isOwner = userData?._id === currentUserId;
  const canEdit = isOwner || isAdmin;
  const canDelete = isOwner || isAdmin;

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'buyer':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'seller':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleSave = async () => {
    if (!editedText.trim() || editedText === comment.comment) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdate(comment._id, editedText.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update comment:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditedText(comment.comment);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setIsDeleting(true);
    try {
      await onDelete(comment._id);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
            {(() => {
              if (!userData) return 'U';
              
              // Try name initial
              if (userData.name) return userData.name[0].toUpperCase();
              
              // Try firstName initial
              if (userData.firstName) return userData.firstName[0].toUpperCase();
              
              // Try email initial
              if (userData.email) return userData.email[0].toUpperCase();
              
              return 'U';
            })()}
          </div>

          {/* User Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {(() => {
                  if (!userData) return 'Unknown User';
                  
                  // Try name field first (from new API)
                  if (userData.name) return userData.name;
                  
                  // Try firstName + lastName
                  if (userData.firstName || userData.lastName) {
                    return `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
                  }
                  
                  // Try companyName
                  if (userData.companyName) return userData.companyName;
                  
                  // Extract readable name from email if available
                  if (userData.email) {
                    const emailName = userData.email.split('@')[0];
                    // Convert 'john.doe' or 'john_doe' to 'John Doe'
                    const formattedName = emailName
                      .split(/[._-]/)
                      .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                      .join(' ');
                    return formattedName;
                  }
                  
                  return 'Unknown User';
                })()}
              </span>
              {((comment as { userRole?: string }).userRole || userData?.role || userData?.user_type) && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getRoleBadgeColor(
                    (comment as { userRole?: string }).userRole || userData?.role || userData?.user_type || ''
                  )}`}
                >
                  {((comment as { userRole?: string }).userRole || userData?.role || userData?.user_type)?.toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
              <span>{formatDate(comment.createdAt)}</span>
              {comment.isEdited && (
                <>
                  <span>•</span>
                  <span className="italic">Edited</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center gap-1">
            {canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit comment"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                title="Delete comment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Comment Content */}
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            maxLength={2000}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {2000 - editedText.length} characters remaining
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                disabled={isUpdating}
                className="px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 inline mr-1" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating || !editedText.trim()}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
              >
                <Save className="w-4 h-4 inline mr-1" />
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {comment.comment}
          </p>

          {/* Attachments */}
          {comment.attachments && comment.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {comment.attachments.map((attachment, index) => {
                const typedAttachment = attachment as { fileName?: string; name?: string; fileType?: string; type?: string; _id?: string; id?: string; fileUrl?: string };
                const fileName = typedAttachment.fileName || typedAttachment.name || 'Attachment';
                const fileType = typedAttachment.fileType || typedAttachment.type || 'file';
                const attachmentId = typedAttachment._id || typedAttachment.id || `attachment-${index}`;
                
                // Extract filename from URL if fileName is still empty
                const displayName = fileName === 'Attachment' && typedAttachment.fileUrl 
                  ? typedAttachment.fileUrl.split('/').pop()?.split('?')[0] || 'Attachment'
                  : fileName;
                
                return (
                  <div
                    key={attachmentId}
                    className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Paperclip className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {displayName}
                        </p>
                        {fileType && <p className="text-xs text-gray-500">{fileType}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={typedAttachment.fileUrl}
                        download={displayName}
                        className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

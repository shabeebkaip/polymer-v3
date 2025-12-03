'use client';

import React, { useState, useRef } from 'react';
import { Send, Loader2, Paperclip, X, Upload, FileText, Image as ImageIcon } from 'lucide-react';
import type { CommentAttachment } from '@/types/comment';
import { postFileUpload } from '@/apiServices/shared';
import { toast } from 'sonner';

interface CommentInputProps {
  onSubmit: (comment: string, attachments: CommentAttachment[]) => Promise<void>;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  placeholder = 'Add a comment...',
  maxLength = 2000,
  disabled = false,
}) => {
  const [comment, setComment] = useState('');
  const [attachments, setAttachments] = useState<CommentAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(comment.trim(), attachments);
      setComment('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate file count
    if (attachments.length + files.length > 5) {
      toast.error('Maximum 5 files allowed per comment');
      return;
    }

    // Validate file size (10MB max per file)
    const maxSize = 10 * 1024 * 1024; // 10MB
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxSize) {
        toast.error(`File "${files[i].name}" is too large. Maximum size is 10MB.`);
        return;
      }
    }

    setIsUploading(true);
    const uploadedFiles: CommentAttachment[] = [];

    try {
      // Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await postFileUpload(formData);
          
          // Convert to CommentAttachment format
          uploadedFiles.push({
            id: response.id,
            name: response.name || file.name,
            type: file.type,
            fileUrl: response.fileUrl,
            viewUrl: response.viewUrl || response.fileUrl,
            uploadedAt: new Date().toISOString(),
          });
        } catch (err: any) {
          console.error(`Failed to upload ${file.name}:`, err);
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (uploadedFiles.length > 0) {
        setAttachments(prev => [...prev, ...uploadedFiles]);
        toast.success(`${uploadedFiles.length} file(s) uploaded successfully`);
      }
    } catch (error) {
      console.error('Failed to upload files:', error);
      toast.error('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4 text-blue-600" />;
    }
    return <FileText className="w-4 h-4 text-blue-600" />;
  };

  const remainingChars = maxLength - comment.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isSubmitting}
        className="w-full resize-none border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-400 min-h-[80px]"
        rows={3}
      />

      {attachments.length > 0 && (
        <div className="mt-3 space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between bg-blue-50 rounded-lg p-3 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  {getFileIcon(attachment.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900 truncate">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    {attachment.type}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeAttachment(attachment.id)}
                disabled={isSubmitting}
                className="flex-shrink-0 p-1.5 text-blue-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                title="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3">
          {/* File Upload Button */}
          <button
            type="button"
            onClick={handleFileSelect}
            disabled={isSubmitting || isUploading || disabled || attachments.length >= 5}
            className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={attachments.length >= 5 ? 'Maximum 5 files allowed' : 'Attach file (Max 10MB each)'}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Paperclip className="w-4 h-4" />
            )}
            <span className="text-sm hidden sm:inline">
              {isUploading ? 'Uploading...' : 'Attach'}
            </span>
            {attachments.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                {attachments.length}/5
              </span>
            )}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
          />

          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                isOverLimit
                  ? 'text-red-600 font-medium'
                  : remainingChars < 100
                  ? 'text-amber-600'
                  : 'text-gray-500'
              }`}
            >
              {remainingChars}
            </span>
            {comment.length > 0 && (
              <span className="text-xs text-gray-400 hidden md:inline">
                (⌘/Ctrl + Enter)
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!comment.trim() || isOverLimit || isSubmitting || isUploading || disabled}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Posting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Post</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

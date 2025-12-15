"use client";
import React, { useState } from 'react';
import { CheckCircle, Send, X, Loader2, Calendar, Paperclip, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { postFileUpload } from '@/apiServices/shared';
import { respondToProductQuoteRequest } from '@/apiServices/user';

interface ProductQuoteSellerResponseProps {
  request?: {
    _id: string;
    [key: string]: unknown;
  };
  sellerResponse?: {
    message?: string;
    quotedPrice?: number;
    quotedQuantity?: string | number;
    estimatedDelivery?: string;
    quotationDocument?: {
      id: string;
      name?: string;
      fileName?: string;
      type: string;
      fileUrl: string;
      viewUrl: string;
      uploadedAt: string;
    };
    respondedAt?: string;
  };
  onResponseSubmitted?: () => void;
  currentUserRole?: 'buyer' | 'seller' | 'admin';
}

export const ProductQuoteSellerResponse: React.FC<ProductQuoteSellerResponseProps> = ({ 
  request, 
  sellerResponse, 
  onResponseSubmitted, 
  currentUserRole 
}) => {
  const [isResponding, setIsResponding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    quotedPrice: '',
    quotedQuantity: '',
    estimatedDelivery: null as Date | null,
  });
  const [quotationFile, setQuotationFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<{
    name: string;
    fileUrl: string;
    type: string;
  } | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const hasResponse = sellerResponse && (sellerResponse.quotedPrice || sellerResponse.quotedQuantity || sellerResponse.message);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF and DOC files are allowed');
      return;
    }

    setQuotationFile(file);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await postFileUpload(formData);
      
      if (response) {
        setUploadedDocument({
          name: response.name || file.name,
          fileUrl: response.fileUrl,
          type: response.type || file.type,
        });
        toast.success('Quotation document uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload quotation document');
      setQuotationFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setQuotationFile(null);
    setUploadedDocument(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!request) {
      toast.error('Request information is missing');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    if (!formData.quotedPrice || parseFloat(formData.quotedPrice) <= 0) {
      toast.error('Please enter a valid quoted price');
      return;
    }
    if (!formData.quotedQuantity || parseInt(formData.quotedQuantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    if (!formData.estimatedDelivery) {
      toast.error('Please select an estimated delivery date');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Submitting your response...');

    try {
      const payload: {
        message: string;
        quotedPrice: number;
        quotedQuantity: number;
        estimatedDelivery: string;
        status: string;
        quotationDocument?: {
          fileName: string;
          fileUrl: string;
          fileType: string;
        };
      } = {
        message: formData.message,
        quotedPrice: parseFloat(formData.quotedPrice),
        quotedQuantity: parseInt(formData.quotedQuantity),
        estimatedDelivery: formData.estimatedDelivery.toISOString().split('T')[0],
        status: 'responded',
      };

      if (uploadedDocument) {
        payload.quotationDocument = {
          fileName: uploadedDocument.name,
          fileUrl: uploadedDocument.fileUrl,
          fileType: uploadedDocument.type,
        };
      }

      await respondToProductQuoteRequest(request._id, payload);

      toast.dismiss(toastId);
      toast.success('Response submitted successfully!');
      setIsResponding(false);
      
      // Reset form
      setFormData({
        message: '',
        quotedPrice: '',
        quotedQuantity: '',
        estimatedDelivery: null,
      });
      setQuotationFile(null);
      setUploadedDocument(null);

      // Notify parent
      if (onResponseSubmitted) {
        onResponseSubmitted();
      }
    } catch (error: unknown) {
      console.error('Error submitting response:', error);
      toast.dismiss(toastId);
      toast.error(
        (error && typeof error === 'object' && 'response' in error &&
         error.response && typeof error.response === 'object' && 'data' in error.response &&
         error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data &&
         typeof error.response.data.message === 'string')
          ? error.response.data.message
          : 'Failed to submit response'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasResponse && !isResponding) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-amber-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Seller Response</h2>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 italic mb-4">
          {currentUserRole === 'seller' ? "You haven't responded to this quote request yet." : "Seller hasn't responded yet."}
        </p>
        {currentUserRole === 'seller' && (
          <Button
            onClick={() => setIsResponding(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Respond to Request
          </Button>
        )}
      </div>
    );
  }

  if (isResponding) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-2 rounded-lg">
              <Send className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Respond to Quote Request</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsResponding(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Enter your response message to the buyer..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full"
            />
          </div>

          {/* Quoted Price and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quoted Price (USD) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={formData.quotedPrice}
                onChange={(e) => setFormData({ ...formData, quotedPrice: e.target.value })}
                className="w-full"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.quotedQuantity}
                onChange={(e) => setFormData({ ...formData, quotedQuantity: e.target.value })}
                className="w-full"
                min="0"
              />
            </div>
          </div>

          {/* Estimated Delivery Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Delivery Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {formData.estimatedDelivery ? (
                  formData.estimatedDelivery.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                ) : (
                  <span className="text-gray-500">Select delivery date</span>
                )}
              </Button>
              {showCalendar && (
                <div className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
                  <CalendarComponent
                    mode="single"
                    selected={formData.estimatedDelivery || undefined}
                    onSelect={(date) => {
                      setFormData({ ...formData, estimatedDelivery: date || null });
                      setShowCalendar(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </div>
              )}
            </div>
          </div>

          {/* Upload Quotation Document */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quotation Document (Optional)
            </label>
            {!quotationFile && !uploadedDocument ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <input
                  type="file"
                  id="quotation-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
                <label
                  htmlFor="quotation-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Paperclip className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click to upload quotation</span>
                  <span className="text-xs text-gray-500 mt-1">PDF or DOC (Max 10MB)</span>
                </label>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {uploading ? 'Uploading...' : quotationFile?.name || uploadedDocument?.name}
                  </span>
                </div>
                {!uploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsResponding(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSubmit}
              disabled={submitting || uploading}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Response
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Display existing response
  return (
    <div className="bg-green-50 rounded-lg border border-green-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-green-100 p-2 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Seller Response</h2>
      </div>

      {sellerResponse && (
        <div className="space-y-4">
          {/* Quote Details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3">
              <span className="text-xs text-gray-500">Quoted Price</span>
              <p className="font-bold text-lg text-green-600">
                ${sellerResponse.quotedPrice?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <span className="text-xs text-gray-500">Quantity</span>
              <p className="font-bold text-gray-900">{sellerResponse.quotedQuantity} units</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <span className="text-xs text-gray-500">Est. Delivery</span>
              <p className="font-bold text-gray-900">
                {sellerResponse.estimatedDelivery && new Date(sellerResponse.estimatedDelivery).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Message */}
          {sellerResponse.message && (
            <div className="bg-white rounded-lg p-4">
              <span className="text-xs text-gray-500 block mb-2">Message</span>
              <p className="text-gray-900">{sellerResponse.message}</p>
            </div>
          )}

          {/* Quotation Document */}
          {sellerResponse.quotationDocument && (
            <div className="bg-white rounded-lg p-4">
              <span className="text-xs text-gray-500 block mb-2">Quotation Document</span>
              <a
                href={sellerResponse.quotationDocument.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                {sellerResponse.quotationDocument.fileName || sellerResponse.quotationDocument.name || 'Download Document'}
              </a>
            </div>
          )}

          {/* Response Date */}
          {sellerResponse.respondedAt && (
            <div className="text-xs text-gray-500">
              Responded on {new Date(sellerResponse.respondedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

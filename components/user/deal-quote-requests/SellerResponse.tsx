"use client";
import React, { useState } from 'react';
import { CheckCircle, DollarSign, Package, Truck, FileText, Download, Paperclip, X, Send, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { postFileUpload } from '@/apiServices/shared';
import axiosInstance from '@/lib/axiosInstance';

interface SellerResponseProps {
  request?: any;
  sellerResponse?: {
    message?: string;
    quotedPrice?: number;
    quotedQuantity?: string | number;
    estimatedDelivery?: string;
    quotationDocument?: {
      id: string;
      name: string;
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

export const SellerResponse: React.FC<SellerResponseProps> = ({ request, sellerResponse, onResponseSubmitted, currentUserRole }) => {
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
  const [uploadedDocument, setUploadedDocument] = useState<any>(null);
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
        setUploadedDocument(response);
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
      const payload: any = {
        message: formData.message,
        quotedPrice: parseFloat(formData.quotedPrice),
        quotedQuantity: parseInt(formData.quotedQuantity),
        estimatedDelivery: formData.estimatedDelivery.toISOString().split('T')[0],
      };

      if (uploadedDocument) {
        payload.quotationDocument = {
          id: uploadedDocument.id,
          name: uploadedDocument.name,
          type: uploadedDocument.type,
          fileUrl: uploadedDocument.fileUrl,
          viewUrl: uploadedDocument.viewUrl || uploadedDocument.fileUrl,
        };
      }

      await axiosInstance.post(`/deal-quote-request/${request._id}/respond`, payload);

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
    } catch (error: any) {
      console.error('Error submitting response:', error);
      toast.dismiss(toastId);
      toast.error(error.response?.data?.message || 'Failed to submit response');
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
              <Input
                type="text"
                readOnly
                value={formData.estimatedDelivery ? formData.estimatedDelivery.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : ''}
                onClick={() => setShowCalendar(!showCalendar)}
                placeholder="Select delivery date"
                className="w-full cursor-pointer"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              {showCalendar && (
                <div className="absolute z-50 mt-2 bg-white shadow-2xl rounded-xl border border-gray-200 p-3">
                  <CalendarComponent
                    mode="single"
                    selected={formData.estimatedDelivery || undefined}
                    onSelect={(date) => {
                      setFormData({ ...formData, estimatedDelivery: date || null });
                      setShowCalendar(false);
                    }}
                    disabled={(date) => date < new Date()}
                    className="rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Quotation Document Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quotation Document (Optional)
            </label>
            {!quotationFile ? (
              <div>
                <input
                  type="file"
                  id="quotation-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
                <label
                  htmlFor="quotation-upload"
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                      <span className="text-sm text-green-600">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Paperclip className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-600">Upload Quotation (PDF, DOC - Max 10MB)</span>
                    </>
                  )}
                </label>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">{quotationFile.name}</p>
                    <p className="text-xs text-green-600">{(quotationFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsResponding(false)}
              className="flex-1"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-green-100 p-2 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Seller Response</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {sellerResponse?.quotedPrice && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <p className="text-xs text-green-600 font-medium">Quoted Price</p>
            </div>
            <p className="text-xl font-bold text-green-700">
              ${sellerResponse.quotedPrice.toLocaleString()}
            </p>
          </div>
        )}

        {sellerResponse?.quotedQuantity && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-blue-600 font-medium">Quoted Quantity</p>
            </div>
            <p className="text-xl font-bold text-blue-700">{sellerResponse.quotedQuantity}</p>
          </div>
        )}

        {sellerResponse?.estimatedDelivery && (
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <Truck className="w-4 h-4 text-purple-600" />
              <p className="text-xs text-purple-600 font-medium">Estimated Delivery</p>
            </div>
            <p className="text-base font-bold text-purple-700">
              {new Date(sellerResponse.estimatedDelivery).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}
      </div>

      {sellerResponse?.message && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-600" />
            Seller's Message
          </h4>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{sellerResponse.message}</p>
        </div>
      )}

      {sellerResponse?.quotationDocument?.fileUrl && (
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-1.5 rounded">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">{sellerResponse.quotationDocument.name}</p>
                <p className="text-xs text-blue-600">Quotation Document</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (sellerResponse?.quotationDocument) {
                  const link = document.createElement('a');
                  link.href = sellerResponse.quotationDocument.fileUrl;
                  link.download = sellerResponse.quotationDocument.name;
                  link.click();
                }
              }}
              className="h-8 px-2 text-blue-600 hover:bg-blue-100"
            >
              <Download className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {sellerResponse?.respondedAt && (
        <p className="text-xs text-gray-500 mt-3">
          Responded on {new Date(sellerResponse.respondedAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      )}
    </div>
  );
};

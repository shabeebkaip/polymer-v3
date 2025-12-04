import React from 'react';
import { CheckCircle, DollarSign, Package, Truck, FileText, Download, Clock } from 'lucide-react';

interface SellerResponseProps {
  sellerResponse?: {
    message?: string;
    quotedPrice?: number;
    quotedQuantity?: string | number;
    leadTime?: string;
    estimatedDelivery?: string;
    termsAndConditions?: string;
    quotationDocument?: {
      fileName: string;
      fileUrl: string;
      uploadedAt: string;
    };
    respondedAt?: string;
  };
}

export const SellerResponse: React.FC<SellerResponseProps> = ({ sellerResponse }) => {
  if (!sellerResponse || (!sellerResponse.quotedPrice && !sellerResponse.quotedQuantity && !sellerResponse.message)) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-lg">
            <CheckCircle className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Seller Response</h2>
        </div>
        <p className="text-sm text-gray-500 italic">No response from seller yet.</p>
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
        {sellerResponse.quotedPrice && (
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

        {sellerResponse.quotedQuantity && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-blue-600 font-medium">Quoted Quantity</p>
            </div>
            <p className="text-xl font-bold text-blue-700">{sellerResponse.quotedQuantity}</p>
          </div>
        )}

        {sellerResponse.estimatedDelivery && (
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
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

        {sellerResponse.leadTime && (
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-orange-600" />
              <p className="text-xs text-orange-600 font-medium">Lead Time</p>
            </div>
            <p className="text-base font-bold text-orange-700">{sellerResponse.leadTime}</p>
          </div>
        )}
      </div>

      {sellerResponse.message && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-600" />
            Seller's Message
          </h4>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{sellerResponse.message}</p>
        </div>
      )}

      {sellerResponse.termsAndConditions && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-600" />
            Terms & Conditions
          </h4>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{sellerResponse.termsAndConditions}</p>
        </div>
      )}

      {sellerResponse.quotationDocument?.fileUrl && (
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-1.5 rounded">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">{sellerResponse.quotationDocument.fileName}</p>
                <p className="text-xs text-blue-600">Quotation Document</p>
              </div>
            </div>
            <a
              href={sellerResponse.quotationDocument.fileUrl}
              download={sellerResponse.quotationDocument.fileName}
              className="h-8 px-3 flex items-center gap-1 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-sm">Download</span>
            </a>
          </div>
        </div>
      )}

      {sellerResponse.respondedAt && (
        <p className="text-xs text-gray-500">
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

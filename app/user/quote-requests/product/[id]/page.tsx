"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductQuoteRequestDetail } from '@/apiServices/user';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import type { 
  ProductQuoteRequestDetail,
  ProductQuoteRequestDetailApiResponse 
} from '@/types/productQuote';
import { useUserInfo } from '@/lib/useUserInfo';
import {
  ProductQuoteRequestHeader,
  ProductInformation,
  OrderDetails,
  SellerResponse,
  SupplierInformation,
  StatusTimeline
} from '@/components/user/product-quote-requests';
import { GenericCommentSection } from '@/components/shared/GenericCommentSection';

const ProductQuoteRequestDetailPage = () => {
  const params = useParams();
  const { user } = useUserInfo();
  const [requestDetail, setRequestDetail] = useState<ProductQuoteRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!params.id || typeof params.id !== 'string') return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response: ProductQuoteRequestDetailApiResponse = await getProductQuoteRequestDetail(params.id);
        if (response.success && response.data) {
          setRequestDetail(response.data);
        } else {
          setError('Failed to fetch request details');
        }
      } catch (err: unknown) {
        console.error('Error fetching product quote request detail:', err);
        setError(
          (err && typeof err === 'object' && 'response' in err && 
           err.response && typeof err.response === 'object' && 'data' in err.response &&
           err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data &&
           typeof err.response.data.message === 'string') 
            ? err.response.data.message 
            : 'Failed to fetch request details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [params.id]);

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium";
    
    switch (status) {
      case "pending": return `${baseClasses} bg-amber-100 text-amber-700 border border-amber-200`;
      case "responded": return `${baseClasses} bg-primary-50 text-primary-600 border border-primary-500/30`;
      case "accepted": return `${baseClasses} bg-emerald-100 text-emerald-700 border border-emerald-200`;
      case "rejected": return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
      case "cancelled": return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
      default: return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4 text-amber-600" />;
      case "responded": return <CheckCircle className="w-4 h-4 text-primary-600" />;
      case "accepted": return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "rejected": return <XCircle className="w-4 h-4 text-red-600" />;
      case "cancelled": return <XCircle className="w-4 h-4 text-gray-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pending";
      case "responded": return "Responded";
      case "accepted": return "Accepted";
      case "rejected": return "Rejected";
      case "cancelled": return "Cancelled";
      default: return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-4 w-10 h-10">
            <div className="absolute inset-0 rounded-full border-3 border-primary-200"></div>
            <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-primary-600 animate-spin"></div>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Loading...</h3>
          <p className="text-xs text-gray-600">Please wait</p>
        </div>
      </div>
    );
  }

  if (error || !requestDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Error Loading Details</h3>
          <p className="text-sm text-gray-600 mb-4">{error || "Request details not found"}</p>
          <button
            onClick={() => window.location.href = '/user/quote-requests/product'}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <ProductQuoteRequestHeader
          requestId={requestDetail._id}
          status={requestDetail.currentStatus}
          createdAt={requestDetail.createdAt}
          getStatusBadge={getStatusBadge}
          getStatusIcon={getStatusIcon}
          getStatusText={getStatusText}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            <ProductInformation product={requestDetail.productId} />
            <OrderDetails 
              orderDetails={{
                quantity: requestDetail.desiredQuantity,
                uom: requestDetail.uom,
                gradeId: requestDetail.gradeId ? {
                  _id: requestDetail.gradeId._id,
                  gradeName: requestDetail.gradeId.name,
                  name: requestDetail.gradeId.name
                } : undefined,
                shippingCountry: requestDetail.shippingCountry || '',
                deliveryDeadline: requestDetail.deliveryDeadline || '',
                incotermId: requestDetail.incotermId,
                packagingTypeId: requestDetail.packagingTypeId,
                paymentTerms: requestDetail.paymentTerms || '',
                application: requestDetail.application,
                shippingAddress: requestDetail.shippingAddress ? {
                  address: requestDetail.shippingAddress,
                  city: requestDetail.shippingCity || '',
                  state: requestDetail.shippingState || '',
                  country: requestDetail.shippingCountry || '',
                  pincode: requestDetail.shippingPincode || ''
                } : undefined,
                additionalRequirements: requestDetail.additionalRequirements
              }}
            />
            <SellerResponse sellerResponse={requestDetail.sellerResponse} />
            
            {/* Comment Section */}
            {user?._id && (
              <GenericCommentSection
                quoteRequestId={requestDetail._id}
                currentUserId={user._id}
                commentType="product-quote"
                userRole={(user && 'user_type' in user ? user.user_type : 'buyer') as 'buyer' | 'seller' | 'admin'}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <StatusTimeline 
              statusHistory={requestDetail.status}
              createdAt={requestDetail.createdAt}
              updatedAt={requestDetail.updatedAt}
              getStatusIcon={getStatusIcon}
            />
            <SupplierInformation seller={{
              _id: requestDetail.sellerId._id,
              name: `${requestDetail.sellerId.firstName} ${requestDetail.sellerId.lastName}`,
              email: requestDetail.sellerId.email,
              phone: requestDetail.sellerId.phone,
              company: requestDetail.sellerId.company
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuoteRequestDetailPage;

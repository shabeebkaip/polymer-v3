"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDealQuoteRequestDetail } from '@/apiServices/user';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Truck,
  Package,
  TrendingUp,
  Loader2,
  ArrowLeft
} from "lucide-react";
import {
  DealQuoteRequestHeader,
  DealInformation,
  OrderDetails,
  SellerResponse,
  SupplierInformation,
  StatusTimeline,
  CommentSection
} from '@/components/user/deal-quote-requests';
import { useUserInfo } from '@/lib/useUserInfo';

interface StatusHistoryItem {
  status: string;
  message: string;
  date: string;
  updatedBy: string;
  _id: string;
}

interface SellerResponse {
  message?: string;
  quotedPrice?: number;
  quotedQuantity?: string;
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
}

interface DealQuoteRequestDetail {
  _id: string;
  status: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
  buyer: {
    _id: string;
    name: string;
    email: string;
    phone?: number;
    company?: string;
    address?: string;
  };
  seller: {
    _id: string;
    name: string;
    email: string;
    phone?: number;
    company?: string;
  };
  deal: {
    _id: string;
    product: {
      _id: string;
      productName?: string;
      chemicalName?: string;
      tradeName?: string;
      description?: string;
      productImages?: Array<{
        id: string;
        name: string;
        type: string;
        fileUrl: string;
        _id: string;
      }>;
      countryOfOrigin?: string;
      color?: string;
      density?: number;
      mfi?: number;
      manufacturingMethod?: string;
    };
  };
  orderDetails: {
    quantity: number;
    shippingCountry: string;
    paymentTerms: string;
    deliveryDeadline: string;
  };
  sellerResponse?: SellerResponse;
  statusHistory: StatusHistoryItem[];
}

const DealQuoteRequestDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useUserInfo();
  const [requestDetail, setRequestDetail] = useState<DealQuoteRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!params.id || typeof params.id !== 'string') return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getDealQuoteRequestDetail(params.id);
        if (response.success && response.data) {
          setRequestDetail(response.data);
        } else {
          setError(response.message || 'Failed to fetch request details');
        }
      } catch (err: any) {
        console.error('Error fetching deal quote request detail:', err);
        setError(err?.response?.data?.message || 'Failed to fetch request details');
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
      case "quoted": return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
      case "accepted": return `${baseClasses} bg-emerald-100 text-emerald-700 border border-emerald-200`;
      case "in_progress": return `${baseClasses} bg-teal-100 text-teal-700 border border-teal-200`;
      case "shipped": return `${baseClasses} bg-green-100 text-green-700 border border-green-200`;
      case "delivered": return `${baseClasses} bg-emerald-100 text-emerald-700 border border-emerald-200`;
      case "completed": return `${baseClasses} bg-green-100 text-green-700 border border-green-200`;
      case "rejected": return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
      case "cancelled": return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
      default: return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4 text-amber-600" />;
      case "quoted": return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "accepted": return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "rejected": return <XCircle className="w-4 h-4 text-red-600" />;
      case "in_progress": return <TrendingUp className="w-4 h-4 text-teal-600" />;
      case "shipped": return <Truck className="w-4 h-4 text-green-600" />;
      case "delivered": return <Package className="w-4 h-4 text-emerald-600" />;
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pending";
      case "quoted": return "Quoted";
      case "accepted": return "Accepted";
      case "in_progress": return "In Progress";
      case "shipped": return "Shipped";
      case "delivered": return "Delivered";
      case "completed": return "Completed";
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
            onClick={() => router.push('/user/quote-requests/deal')}
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
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <DealQuoteRequestHeader
          requestId={requestDetail._id}
          status={requestDetail.status}
          createdAt={requestDetail.createdAt}
          getStatusBadge={getStatusBadge}
          getStatusIcon={getStatusIcon}
          getStatusText={getStatusText}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            <DealInformation deal={requestDetail.deal} />
            <OrderDetails 
              orderDetails={requestDetail.orderDetails} 
              message={requestDetail.message} 
            />
            <SellerResponse sellerResponse={requestDetail.sellerResponse} />
            
            {/* Comment Section */}
            {user && '_id' in user && 'user_type' in user && (
              <CommentSection
                dealQuoteRequestId={requestDetail._id}
                currentUserId={user._id as string}
                userRole={user.user_type as 'buyer' | 'seller' | 'admin'}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <StatusTimeline 
              statusHistory={requestDetail.statusHistory}
              createdAt={requestDetail.createdAt}
              updatedAt={requestDetail.updatedAt}
              getStatusIcon={getStatusIcon}
            />
            <SupplierInformation seller={requestDetail.seller} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealQuoteRequestDetailPage;

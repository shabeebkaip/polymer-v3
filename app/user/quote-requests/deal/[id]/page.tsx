'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDealQuoteRequestDetail } from '@/apiServices/user';
import { getStatusConfig } from '@/lib/config/status.config';
import { XCircle, ArrowLeft } from 'lucide-react';
import {
  DealQuoteRequestHeader,
  DealInformation,
  OrderDetails,
  SellerResponse,
  SupplierInformation,
  StatusTimeline,
} from '@/components/user/deal-quote-requests';
import { GenericCommentSection } from '@/components/shared/GenericCommentSection';
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
  [key: string]: unknown;
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
      } catch (err: unknown) {
        console.error('Error fetching deal quote request detail:', err);
        setError(
          err &&
            typeof err === 'object' &&
            'response' in err &&
            err.response &&
            typeof err.response === 'object' &&
            'data' in err.response &&
            err.response.data &&
            typeof err.response.data === 'object' &&
            'message' in err.response.data &&
            typeof err.response.data.message === 'string'
            ? err.response.data.message
            : 'Failed to fetch request details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [params.id]);

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
          <p className="text-sm text-gray-600 mb-4">{error || 'Request details not found'}</p>
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
      <div className="container mx-auto px-4 py-6 ">
        <DealQuoteRequestHeader
          requestId={requestDetail._id}
          status={requestDetail.status}
          createdAt={requestDetail.createdAt}
          getStatusBadge={(status) => {
            const config = getStatusConfig(status);
            return `inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} border`;
          }}
          getStatusIcon={(status) => {
            const StatusIcon = getStatusConfig(status).icon;
            return <StatusIcon className="w-4 h-4" />;
          }}
          getStatusText={(status) => getStatusConfig(status).text}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            <DealInformation deal={requestDetail.deal} />
            <OrderDetails
              orderDetails={requestDetail.orderDetails}
              message={requestDetail.message}
            />
            <SellerResponse
              sellerResponse={requestDetail.sellerResponse}
              request={requestDetail}
              currentUserRole={
                user && 'user_type' in user
                  ? (user.user_type as 'buyer' | 'seller' | 'admin')
                  : undefined
              }
            />

            {/* Comment Section */}
            {user && '_id' in user && 'user_type' in user && (
              <GenericCommentSection
                quoteRequestId={requestDetail._id}
                currentUserId={user._id as string}
                commentType="deal-quote"
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
              getStatusIcon={(status) => {
                const StatusIcon = getStatusConfig(status).icon;
                return <StatusIcon className="w-5 h-5" />;
              }}
            />
            <SupplierInformation seller={requestDetail.seller} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealQuoteRequestDetailPage;

"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFinanceRequestDetail } from '@/apiServices/user';
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  ArrowLeft,
  CreditCard
} from "lucide-react";
import { FinanceRequestDetailTypes } from '@/types/finance';
import {
  FinanceRequestHeader,
  RequestOverview,
  ProductInformation,
  UserInformation,
  DeliveryInformation,
  RequestTimeline,
  AdditionalInformation
} from '@/components/user/finance-requests';



const FinanceRequestDetail = () => {
  const router = useRouter();
  const params = useParams();
  const [financeRequest, setFinanceRequest] = useState<FinanceRequestDetailTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestId = params.id as string;

  useEffect(() => {
    const fetchFinanceRequestDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getFinanceRequestDetail(requestId);
        if (response.success) {
          setFinanceRequest(response.data);
        } else {
          setError(response.message || 'Failed to fetch finance request details');
        }
      } catch (error) {
        console.error('Error fetching finance request:', error);
        setError(
          typeof error === 'object' && error && 'response' in error && typeof (error as { response?: { data?: { message?: string } } }).response === 'object'
            ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch finance request details'
            : 'Failed to fetch finance request details'
        );
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchFinanceRequestDetail();
    }
  }, [requestId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-primary-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-gray-500" />;
      case "under_review":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case "pending":
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium";
    
    switch (status) {
      case "approved":
        return `${baseClasses} bg-primary-50 text-primary-600 border border-primary-500/30`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
      case "cancelled":
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
      case "under_review":
        return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-700 border border-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "under_review":
        return "Under Review";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateMonthlyEMI = (price: number, months: number) => {
    if (price && months) {
      return (price / months).toFixed(2);
    }
    return "0.00";
  };

  const getPaymentTermsText = (terms: string) => {
    switch (terms) {
      case "advance": return "Advance Payment";
      case "net30": return "Net 30 Days";
      case "net60": return "Net 60 Days";
      case "net90": return "Net 90 Days";
      case "cod": return "Cash on Delivery";
      case "lc": return "Letter of Credit";
      default: return terms;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-4 w-10 h-10">
            <div className="absolute inset-0 rounded-full border-3 border-green-200"></div>
            <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-green-600 animate-spin"></div>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Loading...</h3>
          <p className="text-xs text-gray-600">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Error Loading Request</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.back()} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()} size="sm">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!financeRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <CreditCard className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Request Not Found</h3>
          <p className="text-sm text-gray-600 mb-4">The finance request you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button onClick={() => router.push('/user/finance-requests')} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Finance Requests
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <FinanceRequestHeader
          requestId={financeRequest._id}
          status={financeRequest.status}
          onBack={() => router.push('/user/finance-requests')}
          getStatusBadge={getStatusBadge}
          getStatusIcon={getStatusIcon}
          getStatusText={getStatusText}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            <RequestOverview
              estimatedPrice={financeRequest.estimatedPrice}
              emiMonths={financeRequest.emiMonths}
              quantity={financeRequest.quantity}
              paymentTerms={financeRequest.paymentTerms}
              requireLogisticsSupport={financeRequest.requireLogisticsSupport}
              notes={financeRequest.notes}
              formatCurrency={formatCurrency}
              calculateMonthlyEMI={calculateMonthlyEMI}
              getPaymentTermsText={getPaymentTermsText}
            />

            <ProductInformation product={financeRequest.productId} />

            <AdditionalInformation
              previousPurchaseHistory={financeRequest.previousPurchaseHistory}
              additionalNotes={financeRequest.additionalNotes}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <DeliveryInformation
              country={financeRequest.country}
              destination={financeRequest.destination}
              desiredDeliveryDate={financeRequest.desiredDeliveryDate}
              productGrade={financeRequest.productGrade}
              formatDate={formatDate}
            />

            <RequestTimeline
              createdAt={financeRequest.createdAt}
              updatedAt={financeRequest.updatedAt}
              formatDate={formatDate}
            />

            <UserInformation 
              user={{
                ...financeRequest.productId.createdBy,
                phone: String(financeRequest.productId.createdBy.phone)
              }} 
              title="Product Supplier" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceRequestDetail;

"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSampleRequestStore } from '@/stores/user';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Package,
  ArrowLeft
} from "lucide-react";
import {
  SampleRequestHeader,
  ProductInformation,
  RequestDetails,
  TechnicalProperties,
  UserInformation,
  SupplierInformation,
  StatusTimeline
} from '@/components/user/sample-requests';

const SampleRequestDetail = () => {
  const router = useRouter();
  const params = useParams();
  const { sampleRequestDetail, loading, error, fetchSampleRequestDetail, clearSampleRequestDetail } = useSampleRequestStore();

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      fetchSampleRequestDetail(params.id);
    }

    return () => {
      clearSampleRequestDetail();
    };
  }, [params.id, fetchSampleRequestDetail, clearSampleRequestDetail]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-gray-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "sent":
        return <Package className="w-5 h-5 text-purple-500" />;
      case "responded":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case "pending":
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium";
    
    switch (status) {
      case "approved":
        return `${baseClasses} bg-green-100 text-green-700 border border-green-200`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
      case "cancelled":
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
      case "delivered":
        return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
      case "sent":
        return `${baseClasses} bg-purple-100 text-purple-700 border border-purple-200`;
      case "responded":
        return `${baseClasses} bg-orange-100 text-orange-700 border border-orange-200`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-700 border border-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Pending";
      case "responded": return "Responded";
      case "sent": return "Sent";
      case "delivered": return "Delivered";
      case "approved": return "Approved";
      case "rejected": return "Rejected";
      case "cancelled": return "Cancelled";
      default: return "Unknown";
    }
  };

  const getStatusTimeline = () => {
    const statusOrder = ['pending', 'responded', 'sent', 'delivered', 'approved', 'rejected', 'cancelled'];
    const currentStatusIndex = statusOrder.indexOf(sampleRequestDetail?.status || '');
    
    return statusOrder.map((status, index) => ({
      status,
      label: getStatusText(status),
      completed: index <= currentStatusIndex && !['rejected', 'cancelled'].includes(sampleRequestDetail?.status || ''),
      current: status === sampleRequestDetail?.status,
      icon: getStatusIcon(status)
    }));
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

  if (error || !sampleRequestDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Error Loading Details</h3>
          <p className="text-sm text-gray-600 mb-4">{error || "Sample request details not found"}</p>
          <button
            onClick={() => router.push('/user/sample-requests')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
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
        <SampleRequestHeader
          requestId={sampleRequestDetail._id}
          status={sampleRequestDetail.status}
          getStatusBadge={getStatusBadge}
          getStatusIcon={getStatusIcon}
          getStatusText={getStatusText}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="xl:col-span-2 space-y-6">
            <ProductInformation
              product={sampleRequestDetail.product}
              grade={sampleRequestDetail.grade}
            />

            <RequestDetails
              quantity={sampleRequestDetail.quantity}
              uom={sampleRequestDetail.uom}
              expected_annual_volume={sampleRequestDetail.expected_annual_volume}
              neededBy={sampleRequestDetail.neededBy}
              application={sampleRequestDetail.application}
              message={sampleRequestDetail.message}
              request_document={sampleRequestDetail.request_document}
            />

            <TechnicalProperties
              product={{
                density: String(sampleRequestDetail.product.density),
                mfi: String(sampleRequestDetail.product.mfi),
                tensileStrength: String(sampleRequestDetail.product.tensileStrength),
                elongationAtBreak: String(sampleRequestDetail.product.elongationAtBreak),
                shoreHardness: String(sampleRequestDetail.product.shoreHardness),
                waterAbsorption: String(sampleRequestDetail.product.waterAbsorption)
              }}
            />
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            <UserInformation
              user={sampleRequestDetail.user}
              phone={sampleRequestDetail.phone}
              address={sampleRequestDetail.address}
              country={sampleRequestDetail.country}
            />

            <SupplierInformation
              supplier={sampleRequestDetail.product.createdBy}
            />

            <StatusTimeline
              currentStatus={sampleRequestDetail.status}
              createdAt={sampleRequestDetail.createdAt}
              updatedAt={sampleRequestDetail.updatedAt}
              getStatusTimeline={getStatusTimeline}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleRequestDetail;

"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSampleRequestStore } from '@/stores/user';
import { useUserInfo } from '@/lib/useUserInfo';
import { ArrowLeft, XCircle } from "lucide-react";
import { getStatusConfig } from '@/lib/config/status.config';
import { GenericCommentSection } from '@/components/shared/GenericCommentSection';
import {
  SampleRequestHeader,
  ProductInformation,
  RequestDetails,
  TechnicalProperties,
  UserInformation,
  SupplierInformation,
  StatusTimeline,
  InfoItem
} from '@/components/user/sample-requests';

const SampleRequestDetail = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useUserInfo();
  const { sampleRequestDetail, loading, error, fetchSampleRequestDetail, clearSampleRequestDetail } = useSampleRequestStore();

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      fetchSampleRequestDetail(params.id);
    }

    return () => {
      clearSampleRequestDetail();
    };
  }, [params.id, fetchSampleRequestDetail, clearSampleRequestDetail]);

  const getStatusTimeline = () => {
    const statusOrder = ['pending', 'responded', 'sent', 'delivered', 'approved', 'rejected', 'cancelled'];
    const currentStatusIndex = statusOrder.indexOf(sampleRequestDetail?.status || '');
    
    return statusOrder.map((status, index) => {
      const statusConfig = getStatusConfig(status);
      const StatusIcon = statusConfig.icon;
      return {
        status,
        label: statusConfig.text,
        completed: index <= currentStatusIndex && !['rejected', 'cancelled'].includes(sampleRequestDetail?.status || ''),
        current: status === sampleRequestDetail?.status,
        icon: <StatusIcon className="w-5 h-5" />
      };
    });
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
      <div className="container mx-auto px-4 py-6 ">
        <SampleRequestHeader
          requestId={sampleRequestDetail._id}
          status={sampleRequestDetail.status}
          statusConfig={getStatusConfig(sampleRequestDetail.status)}
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
              sampleSize={sampleRequestDetail.sampleSize}
              uom={sampleRequestDetail.uom}
              expectedAnnualVolume={sampleRequestDetail.expectedAnnualVolume}
              orderDate={sampleRequestDetail.orderDate}
              neededBy={sampleRequestDetail.neededBy}
              application={sampleRequestDetail.application}
              message={sampleRequestDetail.message}
              request_document={sampleRequestDetail.requestDocument || sampleRequestDetail.request_document}
            />

            {/* Technical Properties - Only show if product has these fields */}
            {sampleRequestDetail.product.density && (
              <TechnicalProperties
                product={{
                  density: String(sampleRequestDetail.product.density || ''),
                  mfi: String(sampleRequestDetail.product.mfi || ''),
                  tensileStrength: String(sampleRequestDetail.product.tensileStrength || ''),
                  elongationAtBreak: String(sampleRequestDetail.product.elongationAtBreak || ''),
                  shoreHardness: String(sampleRequestDetail.product.shoreHardness || ''),
                  waterAbsorption: String(sampleRequestDetail.product.waterAbsorption || '')
                }}
              />
            )}

            {/* Comments Section */}
            {user?._id && (
              <GenericCommentSection
                quoteRequestId={sampleRequestDetail._id}
                currentUserId={user._id}
                commentType="sample-request"
                userRole={user.user_type as 'buyer' | 'seller' | 'admin'}
              />
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Buyer Information - Only show for sellers */}
            {user?.user_type !== 'buyer' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Buyer Information</h3>
                <div className="space-y-3">
                  <InfoItem label="Company" value={sampleRequestDetail.buyer.company} valueClassName="font-medium text-gray-900" />
                  <InfoItem label="Contact Person" value={sampleRequestDetail.buyer.name} valueClassName="font-medium text-gray-900" />
                  <InfoItem label="Email" value={sampleRequestDetail.buyer.email} />
                  <InfoItem label="Phone" value={sampleRequestDetail.buyer.phone} />
                  <InfoItem label="Address" value={sampleRequestDetail.buyer.address} />
                </div>
              </div>
            )}

            {/* Seller Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="space-y-3">
                <InfoItem label="Company" value={sampleRequestDetail.seller.company} valueClassName="font-medium text-gray-900" />
                <InfoItem label="Contact Person" value={sampleRequestDetail.seller.name} valueClassName="font-medium text-gray-900" />
                <InfoItem label="Email" value={sampleRequestDetail.seller.email} />
                <InfoItem label="Phone" value={sampleRequestDetail.seller.phone} />
                <InfoItem label="Address" value={sampleRequestDetail.seller.address} />
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
              <div className="space-y-3">
                <InfoItem label="Country" value={sampleRequestDetail.country} valueClassName="font-medium text-gray-900" />
                <InfoItem label="Address" value={sampleRequestDetail.address} />
              </div>
            </div>

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

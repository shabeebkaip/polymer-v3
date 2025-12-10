"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSampleEnquiriesStore } from '@/stores/sampleEnquiriesStore';
import { getRecievedSampleEnquiryDetail, updateSampleEnquiryStatus } from '@/apiServices/user';
import { getStatusConfig } from '@/lib/config/status.config';
import { XCircle, ArrowLeft, Send, Clock, CheckCircle, Factory, Building2, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GenericCommentSection } from '@/components/shared/GenericCommentSection';
import { useUserInfo } from '@/lib/useUserInfo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusOption } from '@/types/sample';
import {
  SampleEnquiryHeader,
  ProductInformation,
  EnquiryDetails,
  TechnicalProperties,
  BuyerInformation,
  InfoItem
} from '@/components/user/sample-enquiries';

const supplierAllowedStatuses: StatusOption[] = [
  { value: 'responded', label: 'Mark as Responded', description: 'You have responded to this enquiry' },
  { value: 'sent', label: 'Mark as Sent', description: 'Sample has been sent to buyer' },
  { value: 'rejected', label: 'Reject Enquiry', description: 'Cannot fulfill this sample request' },
  { value: 'cancelled', label: 'Cancel Enquiry', description: 'Cancel this sample enquiry' }
];

const SampleEnquiriesDetail = React.memo(function SampleEnquiriesDetail() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUserInfo();
  const { 
    enquiryDetail, 
    loading, 
    error, 
    updating, 
    setEnquiryDetail, 
    clearEnquiryDetail, 
    setLoading, 
    setError, 
    setUpdating 
  } = useSampleEnquiriesStore();
  
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const fetchEnquiryDetail = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRecievedSampleEnquiryDetail(id);
      if (response.success && response.data) {
        setEnquiryDetail(response.data);
      } else {
        setError('Failed to load enquiry details');
      }
    } catch (err) {
      setError('Failed to load enquiry details');
      console.error('Error fetching enquiry detail:', err);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setEnquiryDetail]);

  const handleStatusUpdate = useCallback(async () => {
    if (!selectedStatus || !params.id || !enquiryDetail) return;
    
    try {
      setUpdating(true);
      const response = await updateSampleEnquiryStatus(params.id as string, selectedStatus, statusMessage.trim());
      
      if (response.success) {
        setEnquiryDetail({
          ...enquiryDetail,
          status: selectedStatus,
          updatedAt: new Date().toISOString()
        });
        
        setShowStatusUpdate(false);
        setSelectedStatus('');
        setStatusMessage('');
      } else {
        setError('Failed to update status');
      }
    } catch (err) {
      setError('Failed to update status');
      console.error('Error updating status:', err);
    } finally {
      setUpdating(false);
    }
  }, [selectedStatus, params.id, enquiryDetail, statusMessage, setUpdating, setEnquiryDetail, setError]);

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      const shouldFetch = !enquiryDetail || enquiryDetail._id !== params.id;
      if (shouldFetch) {
        fetchEnquiryDetail(params.id);
      }
    }
  }, [params.id, enquiryDetail, fetchEnquiryDetail]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        clearEnquiryDetail();
      }
    };
  }, [clearEnquiryDetail]);

  const getStatusTimeline = useCallback(() => {
    const statusOrder = ['pending', 'responded', 'sent', 'delivered', 'approved', 'rejected', 'cancelled'];
    const currentStatusIndex = statusOrder.indexOf(enquiryDetail?.status || '');
    
    return statusOrder.map((status, index) => {
      const statusConfig = getStatusConfig(status);
      const StatusIcon = statusConfig.icon;
      return {
        status,
        label: statusConfig.text,
        completed: index <= currentStatusIndex && !['rejected', 'cancelled'].includes(enquiryDetail?.status || ''),
        current: status === enquiryDetail?.status,
        icon: <StatusIcon className="w-5 h-5" />
      };
    });
  }, [enquiryDetail?.status]);

  const canUpdateStatus = useCallback((currentStatus: string): StatusOption[] => {
    const allowedTransitions: { [key: string]: string[] } = {
      'pending': ['responded', 'rejected', 'cancelled'],
      'responded': ['sent', 'rejected', 'cancelled'],
      'sent': ['rejected', 'cancelled'],
      'delivered': [],
      'approved': [],
      'rejected': [],
      'cancelled': []
    };
    
    const allowed = allowedTransitions[currentStatus] || [];
    return supplierAllowedStatuses.filter(status => allowed.includes(status.value));
  }, []);

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

  if (error || !enquiryDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Error Loading Details</h3>
          <p className="text-sm text-gray-600 mb-4">{error || "Sample enquiry details not found"}</p>
          <button
            onClick={() => router.push('/user/sample-enquiries')}
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
      <div className="container mx-auto px-4 py-6">
        <SampleEnquiryHeader
          enquiryId={enquiryDetail._id}
          status={enquiryDetail.status}
          statusConfig={getStatusConfig(enquiryDetail.status)}
          canUpdate={canUpdateStatus(enquiryDetail.status).length > 0}
          onUpdateClick={() => setShowStatusUpdate(true)}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="xl:col-span-2 space-y-6">
            <ProductInformation
              product={enquiryDetail.product}
              grade={enquiryDetail.grade}
            />

            <EnquiryDetails
              quantity={enquiryDetail.quantity}
              uom={enquiryDetail.uom}
              sampleSize={enquiryDetail.sampleSize}
              expectedAnnualVolume={enquiryDetail.expected_annual_volume}
              neededBy={enquiryDetail.neededBy}
              application={enquiryDetail.application}
              message={enquiryDetail.message}
              requestDocument={enquiryDetail.request_document}
            />

            <TechnicalProperties product={enquiryDetail.product} />

            {/* Comments Section */}
            {user?._id && (
              <GenericCommentSection
                quoteRequestId={enquiryDetail._id}
                currentUserId={user._id}
                commentType="sample-request"
                userRole={user.user_type as 'buyer' | 'seller' | 'admin'}
              />
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            <BuyerInformation
              user={enquiryDetail.user}
              address={enquiryDetail.address}
              country={enquiryDetail.country}
            />

            {/* Supplier Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Factory className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Your Product</h3>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Factory className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {enquiryDetail.product.createdBy.firstName} {enquiryDetail.product.createdBy.lastName}
                  </p>
                  <p className="text-xs text-gray-600">Supplier (You)</p>
                </div>
              </div>

              <div className="space-y-3">
                <InfoItem
                  label="Company"
                  value={enquiryDetail.product.createdBy.company}
                  icon={<Building2 className="w-4 h-4 text-gray-400" />}
                />
                <InfoItem
                  label="Email"
                  value={enquiryDetail.product.createdBy.email}
                  icon={<Mail className="w-4 h-4 text-gray-400" />}
                />
                <InfoItem
                  label="Phone"
                  value={enquiryDetail.product.createdBy.phone}
                  icon={<Phone className="w-4 h-4 text-gray-400" />}
                />
                <InfoItem
                  label="Address"
                  value={enquiryDetail.product.createdBy.address}
                  icon={<MapPin className="w-4 h-4 text-gray-400" />}
                />
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Status Timeline</h3>
              </div>

              <div className="space-y-3">
                {getStatusTimeline().map((timelineItem, index) => (
                  <div key={timelineItem.status} className="flex items-center gap-3">
                    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      timelineItem.current 
                        ? 'border-green-500 bg-green-50' 
                        : timelineItem.completed 
                          ? 'border-green-500 bg-green-500' 
                          : 'border-gray-300 bg-gray-50'
                    }`}>
                      {timelineItem.completed && !timelineItem.current ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        React.cloneElement(timelineItem.icon, {
                          className: `w-4 h-4 ${
                            timelineItem.current 
                              ? 'text-green-600' 
                              : timelineItem.completed 
                                ? 'text-white'
                                : 'text-gray-400'
                          }`
                        })
                      )}
                      
                      {timelineItem.current && (
                        <div className="absolute -inset-1 rounded-full border-2 border-green-300 animate-pulse"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        timelineItem.current 
                          ? 'text-green-900' 
                          : timelineItem.completed 
                            ? 'text-gray-900'
                            : 'text-gray-500'
                      }`}>
                        {timelineItem.label}
                      </p>
                      {timelineItem.current && (
                        <p className="text-xs text-green-600">Current Status</p>
                      )}
                    </div>
                    
                    {index < getStatusTimeline().length - 1 && (
                      <div className="absolute left-4 w-0.5 h-6 bg-gray-300" style={{ 
                        top: `${index * 48 + 32}px` 
                      }}></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium text-gray-900">
                    {new Date(enquiryDetail.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Updated</span>
                  <span className="font-medium text-gray-900">
                    {new Date(enquiryDetail.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Update Modal */}
        <Dialog open={showStatusUpdate} onOpenChange={setShowStatusUpdate}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Enquiry Status</DialogTitle>
              <DialogDescription>
                Select a new status for this sample enquiry
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                {canUpdateStatus(enquiryDetail?.status || '').map((status: StatusOption) => (
                  <div key={status.value} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50/50 transition-all">
                    <input
                      type="radio"
                      id={status.value}
                      name="status"
                      value={status.value}
                      checked={selectedStatus === status.value}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="mt-1 text-green-600 focus:ring-green-500"
                    />
                    <Label htmlFor={status.value} className="cursor-pointer flex-1">
                      <p className="font-medium text-gray-900">{status.label}</p>
                      <p className="text-sm text-gray-600">{status.description}</p>
                    </Label>
                  </div>
                ))}
              </div>

              <div>
                <Label htmlFor="statusMessage" className="text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </Label>
                <Textarea
                  id="statusMessage"
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  placeholder="Add a message about this status update..."
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowStatusUpdate(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStatusUpdate}
                disabled={!selectedStatus || updating}
                className="flex-1 gap-2"
              >
                {updating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Update Status
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
});

export default SampleEnquiriesDetail;

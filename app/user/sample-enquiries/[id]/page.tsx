"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSampleEnquiriesStore } from '@/stores/sampleEnquiriesStore';
import { getRecievedSampleEnquiryDetail, updateSampleEnquiryStatus } from '@/apiServices/user';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Package, 
  Calendar, 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Factory, 
  Layers, 
  Beaker, 
  AlertCircle,
  ArrowLeft,
  Download,
  Globe,
  Target,
  Truck,
  Settings,
  Edit3,
  Send,
  X,
  FlaskConical
} from "lucide-react";

// Type definitions
interface StatusOption {
  value: string;
  label: string;
  description: string;
}

interface ProductImage {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  _id: string;
}

// Define statuses outside component to prevent recreation
const supplierAllowedStatuses: StatusOption[] = [
  { value: 'responded', label: 'Mark as Responded', description: 'You have responded to this enquiry' },
  { value: 'sent', label: 'Mark as Sent', description: 'Sample has been sent to buyer' },
  { value: 'rejected', label: 'Reject Enquiry', description: 'Cannot fulfill this sample request' },
  { value: 'cancelled', label: 'Cancel Enquiry', description: 'Cancel this sample enquiry' }
];

const SampleEnquiriesDetail = React.memo(() => {
  const router = useRouter();
  const params = useParams();
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

  // Fetch enquiry detail - memoized to prevent unnecessary re-renders
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

  // Update status - memoized to prevent unnecessary re-renders
  const handleStatusUpdate = useCallback(async () => {
    if (!selectedStatus || !params.id || !enquiryDetail) return;
    
    try {
      setUpdating(true);
      const response = await updateSampleEnquiryStatus(params.id as string, selectedStatus, statusMessage.trim());
      
      if (response.success) {
        // Update the local state
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

  // Separate effect for initial fetch
  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      // Check if we need to fetch (don't have data or have data for different ID)
      const shouldFetch = !enquiryDetail || enquiryDetail._id !== params.id;
      if (shouldFetch) {
        fetchEnquiryDetail(params.id);
      }
    }
  }, [params.id, enquiryDetail?._id, fetchEnquiryDetail]);

  // Cleanup effect - separate from fetch effect
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        clearEnquiryDetail();
      }
    };
  }, [clearEnquiryDetail]);

  // Memoized status functions to prevent recreating on every render
  const getStatusIcon = useCallback((status: string) => {
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
  }, []);

  const getStatusBadge = useCallback((status: string) => {
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
  }, []);

  const getStatusText = useCallback((status: string) => {
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
  }, []);

  const getStatusTimeline = useCallback(() => {
    const statusOrder = ['pending', 'responded', 'sent', 'delivered', 'approved', 'rejected', 'cancelled'];
    const currentStatusIndex = statusOrder.indexOf(enquiryDetail?.status || '');
    
    return statusOrder.map((status, index) => ({
      status,
      label: getStatusText(status),
      completed: index <= currentStatusIndex && !['rejected', 'cancelled'].includes(enquiryDetail?.status || ''),
      current: status === enquiryDetail?.status,
      icon: getStatusIcon(status)
    }));
  }, [enquiryDetail?.status, getStatusText, getStatusIcon]);

  const canUpdateStatus = useCallback((currentStatus: string): StatusOption[] => {
    // Supplier can update status based on current status
    const allowedTransitions: { [key: string]: string[] } = {
      'pending': ['responded', 'rejected', 'cancelled'],
      'responded': ['sent', 'rejected', 'cancelled'],
      'sent': ['rejected', 'cancelled'], // Can still reject after sending if sample doesn't reach
      'delivered': [], // Buyer updates this, supplier cannot change
      'approved': [], // Final status - no further updates
      'rejected': [], // Final status - no further updates
      'cancelled': [] // Final status - no further updates
    };
    
    const allowed = allowedTransitions[currentStatus] || [];
    return supplierAllowedStatuses.filter(status => allowed.includes(status.value));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-6 w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-green-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-600 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Sample Enquiry Details...</h3>
          <p className="text-gray-600">Please wait while we fetch the information</p>
        </div>
      </div>
    );
  }

  if (error || !enquiryDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Details</h3>
          <p className="text-gray-600 mb-4">{error || "Sample enquiry details not found"}</p>
          <button
            onClick={() => router.push('/user/sample-enquiries')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sample Enquiries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section with Back Button */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-emerald-600/5 to-teal-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
          
          <div className="relative z-10">
            {/* Back Button */}
            <button
              onClick={() => router.push('/user/sample-enquiries')}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-200/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sample Enquiries
            </button>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
                    <FlaskConical className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                    Sample Enquiry Details
                  </h1>
                  <p className="text-gray-600 text-lg mt-2 font-medium">
                    Enquiry ID: #{enquiryDetail._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-4">
                <span className={getStatusBadge(enquiryDetail.status)}>
                  {getStatusIcon(enquiryDetail.status)}
                  {getStatusText(enquiryDetail.status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="xl:col-span-2 space-y-8">
            {/* Product Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Product Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{enquiryDetail.product.productName}</h3>
                    <p className="text-gray-600">{enquiryDetail.product.description || "No description available"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Chemical Name</p>
                      <p className="font-semibold text-gray-900">{enquiryDetail.product.chemicalName || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Trade Name</p>
                      <p className="font-semibold text-gray-900">{enquiryDetail.product.tradeName || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Color</p>
                      <p className="font-semibold text-gray-900">{enquiryDetail.product.color || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Country of Origin</p>
                      <p className="font-semibold text-gray-900">{enquiryDetail.product.countryOfOrigin || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Manufacturing Method</p>
                      <p className="font-semibold text-gray-900">{enquiryDetail.product.manufacturingMethod || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200/50">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <Beaker className="w-5 h-5" />
                      Grade: {enquiryDetail.grade.name}
                    </h4>
                    <p className="text-green-700 text-sm mb-3">{enquiryDetail.grade.description}</p>
                  </div>

                  {/* Product Images */}
                  {enquiryDetail.product.productImages && enquiryDetail.product.productImages.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200/50">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <Layers className="w-5 h-5" />
                        Product Images
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {enquiryDetail.product.productImages.slice(0, 4).map((image: ProductImage, index: number) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.fileUrl}
                              alt={image.name}
                              className="w-full h-20 object-cover rounded-lg border border-blue-200"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg"></div>
                          </div>
                        ))}
                      </div>
                      {enquiryDetail.product.productImages.length > 4 && (
                        <p className="text-xs text-blue-600 mt-2">
                          +{enquiryDetail.product.productImages.length - 4} more images
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-3 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Enquiry Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Quantity</p>
                  </div>
                  <p className="font-bold text-xl text-gray-900">{enquiryDetail.quantity} {enquiryDetail.uom}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Annual Volume</p>
                  </div>
                  <p className="font-bold text-xl text-gray-900">{enquiryDetail.expected_annual_volume.toLocaleString()} {enquiryDetail.uom}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Needed By</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {new Date(enquiryDetail.neededBy).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Factory className="w-5 h-5 text-gray-600" />
                    Application
                  </h4>
                  <p className="text-gray-700 bg-gray-50 rounded-xl p-4">{enquiryDetail.application}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    Message
                  </h4>
                  <p className="text-gray-700 bg-gray-50 rounded-xl p-4">{enquiryDetail.message}</p>
                </div>
              </div>

              {enquiryDetail.request_document && (
                <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900">Attached Document</p>
                        <p className="text-sm text-blue-700">{enquiryDetail.request_document}</p>
                      </div>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Technical Properties */}
            {enquiryDetail.product.density && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-3 rounded-xl">
                    <Settings className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Technical Properties</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {enquiryDetail.product.density && (
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200/50">
                      <p className="text-sm text-purple-600 mb-1">Density</p>
                      <p className="font-semibold text-purple-900">{enquiryDetail.product.density} g/cm³</p>
                    </div>
                  )}
                  {enquiryDetail.product.mfi && (
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200/50">
                      <p className="text-sm text-purple-600 mb-1">Melt Flow Index (MFI)</p>
                      <p className="font-semibold text-purple-900">{enquiryDetail.product.mfi} g/10min</p>
                    </div>
                  )}
                  {enquiryDetail.product.tensileStrength && (
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200/50">
                      <p className="text-sm text-purple-600 mb-1">Tensile Strength</p>
                      <p className="font-semibold text-purple-900">{enquiryDetail.product.tensileStrength} MPa</p>
                    </div>
                  )}
                  {enquiryDetail.product.elongationAtBreak && (
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200/50">
                      <p className="text-sm text-purple-600 mb-1">Elongation at Break</p>
                      <p className="font-semibold text-purple-900">{enquiryDetail.product.elongationAtBreak}%</p>
                    </div>
                  )}
                  {enquiryDetail.product.shoreHardness && (
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200/50">
                      <p className="text-sm text-purple-600 mb-1">Shore Hardness</p>
                      <p className="font-semibold text-purple-900">{enquiryDetail.product.shoreHardness} Shore D</p>
                    </div>
                  )}
                  {enquiryDetail.product.waterAbsorption && (
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200/50">
                      <p className="text-sm text-purple-600 mb-1">Water Absorption</p>
                      <p className="font-semibold text-purple-900">{enquiryDetail.product.waterAbsorption}%</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-8">
            {/* Buyer Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Enquiry From</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{enquiryDetail.user.name}</p>
                    <p className="text-sm text-gray-600">Buyer</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{enquiryDetail.user.company}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{enquiryDetail.user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{enquiryDetail.user.phone}</span>
                  </div>
                  <div className="flex items-start gap-3 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div className="text-sm">
                      <p>{enquiryDetail.address}</p>
                      <p>{enquiryDetail.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supplier Information (Your Product) */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 p-3 rounded-xl">
                  <Factory className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Your Product</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                    <Factory className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {enquiryDetail.product.createdBy.firstName} {enquiryDetail.product.createdBy.lastName}
                    </p>
                    <p className="text-sm text-gray-600">Supplier (You)</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{enquiryDetail.product.createdBy.company}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{enquiryDetail.product.createdBy.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{enquiryDetail.product.createdBy.phone}</span>
                  </div>
                  <div className="flex items-start gap-3 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div className="text-sm">
                      <p>{enquiryDetail.product.createdBy.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Status Timeline</h3>
                </div>
                
                {/* Status Update Button */}
                {enquiryDetail && canUpdateStatus(enquiryDetail.status).length > 0 && (
                  <Button
                    onClick={() => setShowStatusUpdate(true)}
                    size="sm"
                    className="gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Update Status
                  </Button>
                )}
              </div>

              {/* Timeline Progress */}
              <div className="relative">
                {getStatusTimeline().map((timelineItem, index) => (
                  <div key={timelineItem.status} className="flex items-center mb-4 last:mb-0">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        timelineItem.current 
                          ? 'border-green-500 bg-green-50' 
                          : timelineItem.completed 
                            ? 'border-green-500 bg-green-500' 
                            : 'border-gray-300 bg-gray-50'
                      }`}>
                        {timelineItem.completed && !timelineItem.current ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          React.cloneElement(timelineItem.icon, {
                            className: `w-5 h-5 ${
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
                        <p className={`font-semibold ${
                          timelineItem.current 
                            ? 'text-green-900' 
                            : timelineItem.completed 
                              ? 'text-gray-900'
                              : 'text-gray-500'
                        }`}>
                          {timelineItem.label}
                        </p>
                        {timelineItem.current && (
                          <p className="text-sm text-green-600 font-medium">Current Status</p>
                        )}
                      </div>
                    </div>
                    
                    {index < getStatusTimeline().length - 1 && (
                      <div className={`absolute left-5 mt-10 w-0.5 h-6 ${
                        timelineItem.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`} style={{ top: `${index * 64 + 40}px` }}></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Timestamps */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Enquiry Created</span>
                  <span className="font-medium text-gray-900">
                    {new Date(enquiryDetail?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium text-gray-900">
                    {new Date(enquiryDetail?.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
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
              {/* Status Selection */}
              <div className="space-y-2">
                {canUpdateStatus(enquiryDetail?.status || '').map((status: StatusOption) => (
                  <div key={status.value} className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50/50 transition-all">
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

              {/* Status Message */}
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
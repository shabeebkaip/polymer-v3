"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuoteRequestStore } from '@/stores/user';
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
  TrendingUp
} from "lucide-react";

const QuoteRequestDetail = () => {
  const router = useRouter();
  const params = useParams();
  const { quoteRequestDetail, loading, error, updating, fetchQuoteRequestDetail, updateStatus, clearQuoteRequestDetail } = useQuoteRequestStore();
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Define which statuses a buyer can update to
  const buyerAllowedStatuses = [
    { value: 'negotiation', label: 'Start Negotiation', description: 'Negotiate terms and pricing' },
    { value: 'approved', label: 'Approve Quote', description: 'Accept the quoted price and terms' },
    { value: 'rejected', label: 'Reject Quote', description: 'Quote does not meet requirements' },
    { value: 'cancelled', label: 'Cancel Request', description: 'Cancel this quote request' }
  ];

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      fetchQuoteRequestDetail(params.id);
    }

    return () => {
      clearQuoteRequestDetail();
    };
  }, [params.id, fetchQuoteRequestDetail, clearQuoteRequestDetail]);

  const handleStatusUpdate = async () => {
    if (!selectedStatus || !params.id) return;
    
    const success = await updateStatus(params.id as string, selectedStatus, statusMessage.trim() || 'Status updated');
    if (success) {
      setShowStatusUpdate(false);
      setSelectedStatus('');
      setStatusMessage('');
    }
  };

  const getStatusTimeline = () => {
    const statusOrder = ['pending', 'responded', 'negotiation', 'approved', 'fulfilled', 'rejected', 'cancelled'];
    const currentStatusIndex = statusOrder.indexOf(quoteRequestDetail?.status || '');
    
    return statusOrder.map((status, index) => ({
      status,
      label: getStatusText(status),
      completed: index <= currentStatusIndex && !['rejected', 'cancelled'].includes(quoteRequestDetail?.status || ''),
      current: status === quoteRequestDetail?.status,
      icon: getStatusIcon(status)
    }));
  };

  const canUpdateStatus = (currentStatus: string) => {
    // Buyer can update status based on current status - EXPANDED for testing
    const allowedTransitions: { [key: string]: string[] } = {
      'pending': ['cancelled'], // Allow cancellation from pending
      'responded': ['negotiation', 'approved', 'rejected'],
      'negotiation': ['approved', 'rejected'],
      'approved': [], // Final status - no further updates
      'fulfilled': [], // Final status - no further updates  
      'rejected': [], // Final status - no further updates
      'cancelled': [] // Final status - no further updates
    };
    
    const allowed = allowedTransitions[currentStatus] || [];
    return buyerAllowedStatuses.filter(status => allowed.includes(status.value));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "fulfilled":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "negotiation":
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
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
      case "fulfilled":
        return `${baseClasses} bg-green-100 text-green-800 border border-green-300`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
      case "cancelled":
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
      case "negotiation":
        return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
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
      case "negotiation": return "Negotiation";
      case "approved": return "Approved";
      case "rejected": return "Rejected";
      case "cancelled": return "Cancelled";
      case "fulfilled": return "Fulfilled";
      default: return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-6 w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-green-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-600 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Quote Request Details...</h3>
          <p className="text-gray-600">Please wait while we fetch the information</p>
        </div>
      </div>
    );
  }

  if (error || !quoteRequestDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Details</h3>
          <p className="text-gray-600 mb-4">{error || "Quote request details not found"}</p>
          <button
            onClick={() => router.push('/user/quote-requests')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quote Requests
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
              onClick={() => router.push('/user/quote-requests')}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-200/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Quote Requests
            </button>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                    Quote Request Details
                  </h1>
                  <p className="text-gray-600 text-lg mt-2 font-medium">
                    Request ID: #{quoteRequestDetail._id.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-4">
                <span className={getStatusBadge(quoteRequestDetail.status)}>
                  {getStatusIcon(quoteRequestDetail.status)}
                  {getStatusText(quoteRequestDetail.status)}
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{quoteRequestDetail.product.productName}</h3>
                    <p className="text-gray-600">{quoteRequestDetail.product.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Chemical Name</p>
                      <p className="font-semibold text-gray-900">{quoteRequestDetail.product.chemicalName}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Trade Name</p>
                      <p className="font-semibold text-gray-900">{quoteRequestDetail.product.tradeName}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Color</p>
                      <p className="font-semibold text-gray-900">{quoteRequestDetail.product.color}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Country of Origin</p>
                      <p className="font-semibold text-gray-900">{quoteRequestDetail.product.countryOfOrigin}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Manufacturing Method</p>
                      <p className="font-semibold text-gray-900">{quoteRequestDetail.product.manufacturingMethod}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200/50">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <Beaker className="w-5 h-5" />
                      Grade: {quoteRequestDetail.grade.name}
                    </h4>
                    <p className="text-green-700 text-sm mb-3">{quoteRequestDetail.grade.description}</p>
                  </div>

                  {/* Product Images */}
                  {quoteRequestDetail.product.productImages && quoteRequestDetail.product.productImages.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200/50">
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <Layers className="w-5 h-5" />
                        Product Images
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {quoteRequestDetail.product.productImages.slice(0, 4).map((image, index) => (
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
                      {quoteRequestDetail.product.productImages.length > 4 && (
                        <p className="text-xs text-blue-600 mt-2">
                          +{quoteRequestDetail.product.productImages.length - 4} more images
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
                <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Quantity</p>
                  </div>
                  <p className="font-bold text-xl text-gray-900">{quoteRequestDetail.quantity} {quoteRequestDetail.uom}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Annual Volume</p>
                  </div>
                  <p className="font-bold text-xl text-gray-900">{quoteRequestDetail.expected_annual_volume.toLocaleString()} {quoteRequestDetail.uom}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Needed By</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {new Date(quoteRequestDetail.neededBy).toLocaleDateString('en-US', {
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
                  <p className="text-gray-700 bg-gray-50 rounded-xl p-4">{quoteRequestDetail.application}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    Message
                  </h4>
                  <p className="text-gray-700 bg-gray-50 rounded-xl p-4">{quoteRequestDetail.message}</p>
                </div>
              </div>

              {quoteRequestDetail.request_document && (
                <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900">Attached Document</p>
                        <p className="text-sm text-blue-700">{quoteRequestDetail.request_document}</p>
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-3 rounded-xl">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Technical Properties</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200/50">
                  <p className="text-sm text-purple-600 mb-1">Density</p>
                  <p className="font-semibold text-purple-900">{quoteRequestDetail.product.density} g/cm³</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200/50">
                  <p className="text-sm text-purple-600 mb-1">Melt Flow Index (MFI)</p>
                  <p className="font-semibold text-purple-900">{quoteRequestDetail.product.mfi} g/10min</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200/50">
                  <p className="text-sm text-purple-600 mb-1">Tensile Strength</p>
                  <p className="font-semibold text-purple-900">{quoteRequestDetail.product.tensileStrength} MPa</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200/50">
                  <p className="text-sm text-purple-600 mb-1">Elongation at Break</p>
                  <p className="font-semibold text-purple-900">{quoteRequestDetail.product.elongationAtBreak}%</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200/50">
                  <p className="text-sm text-purple-600 mb-1">Shore Hardness</p>
                  <p className="font-semibold text-purple-900">{quoteRequestDetail.product.shoreHardness} Shore D</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200/50">
                  <p className="text-sm text-purple-600 mb-1">Water Absorption</p>
                  <p className="font-semibold text-purple-900">{quoteRequestDetail.product.waterAbsorption}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-8">
            {/* User Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Requested By</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {quoteRequestDetail.user.firstName} {quoteRequestDetail.user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{quoteRequestDetail.user.userType}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{quoteRequestDetail.user.company}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{quoteRequestDetail.user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{quoteRequestDetail.phone}</span>
                  </div>
                  <div className="flex items-start gap-3 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div className="text-sm">
                      <p>{quoteRequestDetail.address}</p>
                      <p>{quoteRequestDetail.user.city}, {quoteRequestDetail.user.state}</p>
                      <p>{quoteRequestDetail.country} - {quoteRequestDetail.user.pincode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Supplier Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 p-3 rounded-xl">
                  <Factory className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Supplier Details</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                    <Factory className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {quoteRequestDetail.product.createdBy.firstName} {quoteRequestDetail.product.createdBy.lastName}
                    </p>
                    <p className="text-sm text-gray-600">Supplier</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{quoteRequestDetail.product.createdBy.company}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{quoteRequestDetail.product.createdBy.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{quoteRequestDetail.product.createdBy.phone}</span>
                  </div>
                  <div className="flex items-start gap-3 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div className="text-sm">
                      <p>{quoteRequestDetail.product.createdBy.address}</p>
                      <p>{quoteRequestDetail.product.createdBy.city}, {quoteRequestDetail.product.createdBy.state}</p>
                      <p>{quoteRequestDetail.product.createdBy.country}</p>
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
                {quoteRequestDetail && canUpdateStatus(quoteRequestDetail.status).length > 0 && (
                  <Button
                    onClick={() => setShowStatusUpdate(true)}
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    Update
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
                  <span className="text-gray-600">Request Created</span>
                  <span className="font-medium text-gray-900">
                    {new Date(quoteRequestDetail?.createdAt).toLocaleDateString('en-US', {
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
                    {new Date(quoteRequestDetail?.updatedAt).toLocaleDateString('en-US', {
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

            {/* Status Update Modal */}
            <Dialog open={showStatusUpdate} onOpenChange={setShowStatusUpdate}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Update Status</DialogTitle>
                  <DialogDescription>
                    Select a new status for this quote request.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  {/* Status Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Select New Status</Label>
                    <div className="space-y-2">
                      {canUpdateStatus(quoteRequestDetail?.status || '').map((status) => (
                        <div key={status.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50/50 transition-all">
                          <input
                            type="radio"
                            id={status.value}
                            name="status"
                            value={status.value}
                            checked={selectedStatus === status.value}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="mt-0.5 text-green-600 focus:ring-green-500"
                          />
                          <div className="flex-1">
                            <Label htmlFor={status.value} className="font-medium cursor-pointer">
                              {status.label}
                            </Label>
                            <p className="text-sm text-gray-600 mt-1">{status.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">
                      Message (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Add a message about this status update..."
                      value={statusMessage}
                      onChange={(e) => setStatusMessage(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowStatusUpdate(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={!selectedStatus || updating}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {updating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Update Status
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteRequestDetail;
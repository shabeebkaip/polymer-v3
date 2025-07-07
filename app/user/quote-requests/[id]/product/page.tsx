"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuoteRequestStore } from '@/stores/user';
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
  Target,
  Truck
} from "lucide-react";
import Image from 'next/image';

// Define types for the unified quote request structure
type QuoteRequestType = "product_quote" | "deal_quote";

type QuoteStatus = "pending" | "responded" | "negotiation" | "accepted" | "in_progress" | 
  "shipped" | "delivered" | "completed" | "rejected" | "cancelled";

const QuoteRequestDetail = () => {
  const router = useRouter();
  const params = useParams();
  const { quoteRequestDetail, loading, error, fetchQuoteRequestDetail, clearQuoteRequestDetail } = useQuoteRequestStore();

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      fetchQuoteRequestDetail(params.id);
    }

    return () => {
      clearQuoteRequestDetail();
    };
  }, [params.id, fetchQuoteRequestDetail, clearQuoteRequestDetail]);

  const getStatusTimeline = () => {
    const statusOrder = ['pending', 'responded', 'negotiation', 'accepted', 'in_progress', 'shipped', 'delivered', 'completed', 'rejected', 'cancelled'];
    const currentStatusIndex = statusOrder.indexOf(quoteRequestDetail?.status || '');
    
    return statusOrder.map((status, index) => ({
      status,
      label: getStatusText(status),
      completed: index <= currentStatusIndex && !['rejected', 'cancelled'].includes(quoteRequestDetail?.status || ''),
      current: status === quoteRequestDetail?.status,
      icon: getStatusIcon(status)
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "negotiation":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "responded":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-purple-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-indigo-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "pending":
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium";
    
    switch (status) {
      case "accepted":
        return `${baseClasses} bg-green-100 text-green-700 border border-green-200`;
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800 border border-green-300`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
      case "cancelled":
        return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
      case "negotiation":
        return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
      case "responded":
        return `${baseClasses} bg-orange-100 text-orange-700 border border-orange-200`;
      case "in_progress":
        return `${baseClasses} bg-purple-100 text-purple-700 border border-purple-200`;
      case "shipped":
        return `${baseClasses} bg-indigo-100 text-indigo-700 border border-indigo-200`;
      case "delivered":
        return `${baseClasses} bg-emerald-100 text-emerald-700 border border-emerald-200`;
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
      case "accepted": return "Accepted";
      case "rejected": return "Rejected";
      case "cancelled": return "Cancelled";
      case "in_progress": return "In Progress";
      case "shipped": return "Shipped";
      case "delivered": return "Delivered";
      case "completed": return "Completed";
      default: return "Unknown";
    }
  };

  // Helper function to get product information for product quotes only
  const getProductInfo = () => {
    if (!quoteRequestDetail || quoteRequestDetail.requestType !== 'product_quote') return null;
    
    return quoteRequestDetail.product || null;
  };

  // Helper function to get supplier information
  const getSupplierInfo = () => {
    const productInfo = getProductInfo();
    return productInfo?.creator || null;
  };

  // Helper function to get product quote specific details
  const getRequestDetails = () => {
    if (!quoteRequestDetail || quoteRequestDetail.requestType !== 'product_quote') return null;
    
    return {
      quantity: quoteRequestDetail.orderDetails?.quantity || quoteRequestDetail.unified?.quantity || 0,
      unit: quoteRequestDetail.orderDetails?.uom || 'units',
      destination: quoteRequestDetail.orderDetails?.destination || quoteRequestDetail.unified?.destination || 'N/A',
      country: quoteRequestDetail.orderDetails?.country || quoteRequestDetail.unified?.location || 'N/A',
      deliveryDate: quoteRequestDetail.orderDetails?.deliveryDate || quoteRequestDetail.unified?.deliveryDate || '',
      grade: quoteRequestDetail.specifications?.grade?.name || 'N/A',
      packagingSize: quoteRequestDetail.orderDetails?.packagingSize || 'N/A',
      incoterm: quoteRequestDetail.specifications?.incoterm?.name || 'N/A'
    };
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
          <p className="text-gray-600 mb-4">{error || "Product quote details not found"}</p>
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

  // Redirect if this is not a product quote
  if (quoteRequestDetail.requestType !== 'product_quote') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Wrong Quote Type</h3>
          <p className="text-gray-600 mb-4">This page is for product quotes only. This appears to be a deal quote.</p>
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
                    Product Quote Details
                  </h1>
                  <p className="text-gray-600 text-lg mt-2 font-medium">
                    Request ID: #{params.id?.toString().slice(-8).toUpperCase() || 'N/A'}
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {getProductInfo()?.productName || 'N/A'}
                    </h3>
                    <p className="text-gray-600">
                      {getProductInfo()?.description || 'No description available'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Chemical Name</p>
                      <p className="font-semibold text-gray-900">
                        {getProductInfo()?.chemicalName || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Quote Type</p>
                      <p className="font-semibold text-gray-900 capitalize">
                        Product Quote
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Country of Origin</p>
                      <p className="font-semibold text-gray-900">
                        {getProductInfo()?.countryOfOrigin || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Grade</p>
                      <p className="font-semibold text-gray-900">
                        {getRequestDetails()?.grade || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Product-specific grade information */}
                  {quoteRequestDetail.specifications?.grade && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200/50">
                      <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                        <Beaker className="w-5 h-5" />
                        Grade: {quoteRequestDetail.specifications.grade.name}
                      </h4>
                      <p className="text-green-700 text-sm mb-3">
                        {quoteRequestDetail.specifications.grade.description || 'No description available'}
                      </p>
                    </div>
                  )}

                  {/* Product Images */}
                  {(() => {
                    const productInfo = getProductInfo();
                    const images = productInfo?.productImages;
                    return images && images.length > 0 && (
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200/50">
                        <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                          <Layers className="w-5 h-5" />
                          Product Images
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {images.slice(0, 4).map((image: { id: string; fileUrl: string; name: string }) => (
                            <div key={image.id} className="relative group">
                              <Image
                                src={image.fileUrl}
                                alt={image.name}
                                width={160}
                                height={80}
                                className="w-full h-20 object-cover rounded-lg border border-orange-200"
                                style={{ objectFit: 'cover' }}
                                priority={false}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg"></div>
                            </div>
                          ))}
                        </div>
                        {images.length > 4 && (
                          <p className="text-xs text-orange-600 mt-2">
                            +{images.length - 4} more images
                          </p>
                        )}
                      </div>
                    );
                  })()}
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
                  <p className="font-bold text-xl text-gray-900">
                    {getRequestDetails()?.quantity} {getRequestDetails()?.unit}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Packaging Size</p>
                  </div>
                  <p className="font-bold text-xl text-gray-900">
                    {getRequestDetails()?.packagingSize || 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Delivery Date</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {getRequestDetails()?.deliveryDate ? 
                      new Date(getRequestDetails()!.deliveryDate!).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'
                    }
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    Destination
                  </h4>
                  <p className="text-gray-700 bg-gray-50 rounded-xl p-4">
                    {getRequestDetails()?.destination}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Beaker className="w-5 h-5 text-gray-600" />
                    Grade
                  </h4>
                  <p className="text-gray-700 bg-gray-50 rounded-xl p-4">
                    {getRequestDetails()?.grade}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Terms */}
            {getRequestDetails()?.incoterm !== 'N/A' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-3 rounded-xl">
                    <Truck className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Shipping Terms</h2>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200/50">
                  <p className="text-sm text-purple-600 mb-2">Incoterm</p>
                  <p className="font-bold text-xl text-purple-900">{getRequestDetails()?.incoterm}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-8">
            {/* Requester Information */}
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
                      {quoteRequestDetail.requester?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">Buyer</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{quoteRequestDetail.requester?.company || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{quoteRequestDetail.requester?.email || 'N/A'}</span>
                  </div>
                  {quoteRequestDetail.requester?.phone && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{quoteRequestDetail.requester.phone}</span>
                    </div>
                  )}
                  {quoteRequestDetail.requester?.address?.full && (
                    <div className="flex items-start gap-3 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div className="text-sm">
                        <p>{quoteRequestDetail.requester.address.full}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Supplier Information */}
            {getSupplierInfo() && (
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
                        {getSupplierInfo()?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">Supplier</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{getSupplierInfo()?.company || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{getSupplierInfo()?.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Status Timeline */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Status Timeline</h3>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteRequestDetail;
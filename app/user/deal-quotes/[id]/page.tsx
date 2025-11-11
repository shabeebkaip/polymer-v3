"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  AlertCircle,
  ArrowLeft,
  Target,
  Truck,
  TrendingUp,
  DollarSign,
  Tags,
  Gift
} from "lucide-react";
import Image from 'next/image';
import { getDealQuoteDetail } from "@/apiServices/user";
import { useUserInfo } from '@/lib/useUserInfo';
import { toast } from 'sonner';

const DealQuoteDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useUserInfo();
  const [quoteDetail, setQuoteDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Access control - only sellers can access this page
  useEffect(() => {
    if (user && user.user_type !== 'seller') {
      toast.error("Access denied. This page is only for sellers.");
      router.push('/user/profile');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!params.id || typeof params.id !== 'string') return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getDealQuoteDetail(params.id);
        if (response.success) {
          setQuoteDetail(response.data);
        } else {
          setError(response.message || "Failed to fetch deal quote details");
          toast.error("Failed to fetch deal quote details");
        }
      } catch (err) {
        console.error("Error fetching deal quote detail:", err);
        setError("An error occurred while fetching deal quote details");
        toast.error("An error occurred while fetching deal quote details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [params.id]);

  const getStatusTimeline = () => {
    const statusOrder = ['pending', 'responded', 'negotiation', 'accepted', 'in_progress', 'shipped', 'delivered', 'completed', 'rejected', 'cancelled'];
    const currentStatus = quoteDetail?.status || '';
    const currentStatusIndex = statusOrder.indexOf(currentStatus);

    const full = statusOrder.map((status, index) => ({
      status,
      label: getStatusText(status),
      completed: index <= currentStatusIndex && !['rejected', 'cancelled'].includes(currentStatus),
      current: status === currentStatus,
      icon: getStatusIcon(status)
    }));

    // For buyers, only show statuses up to (and including) current one
    if (user?.user_type === 'buyer' && currentStatusIndex >= 0) {
      return full.filter((_, idx) => idx <= currentStatusIndex);
    }
    return full;
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
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-6 w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Deal Quote Details...</h3>
          <p className="text-gray-600">Please wait while we fetch the information</p>
        </div>
      </div>
    );
  }

  if (error || !quoteDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Details</h3>
          <p className="text-gray-600 mb-4">{error || "Deal quote details not found"}</p>
          <button
            onClick={() => router.push('/user/deal-quotes')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Deal Quotes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-emerald-50/30">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section with Back Button */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-emerald-600/5 to-teal-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-emerald-200/20 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
          
          <div className="relative z-10">
            {/* Back Button */}
            <button
              onClick={() => router.push('/user/deal-quotes')}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-200/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Deal Quotes
            </button>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
                    <Gift className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-emerald-800 bg-clip-text text-transparent">
                    Deal Quote Details
                  </h1>
                  <p className="text-gray-600 text-lg mt-2 font-medium">
                    Request ID: #{params.id?.toString().slice(-8).toUpperCase() || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-4">
                <span className={getStatusBadge(quoteDetail.status)}>
                  {getStatusIcon(quoteDetail.status)}
                  {getStatusText(quoteDetail.status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="xl:col-span-2 space-y-8">
            {/* Deal Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-100 to-emerald-100 p-3 rounded-xl">
                  <Gift className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Deal Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {quoteDetail.deal?.dealTitle || 'N/A'}
                  </h3>
                  <p className="text-gray-600">
                    {quoteDetail.deal?.dealDescription || 'No description available'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200/50">
                    <p className="text-sm text-green-600 mb-1">Deal Price</p>
                    <p className="font-bold text-2xl text-green-900">
                      ${quoteDetail.deal?.dealPrice || 0} {quoteDetail.deal?.currency || 'USD'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200/50">
                    <p className="text-sm text-orange-600 mb-1">Discount</p>
                    <p className="font-bold text-2xl text-orange-900">
                      {quoteDetail.deal?.discountPercentage || 0}% OFF
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Valid From</p>
                    <p className="font-semibold text-gray-900">
                      {quoteDetail.deal?.validFrom 
                        ? new Date(quoteDetail.deal.validFrom).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Valid Until</p>
                    <p className="font-semibold text-gray-900">
                      {quoteDetail.deal?.validUntil 
                        ? new Date(quoteDetail.deal.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Deal Images */}
                {quoteDetail.deal?.dealImages && quoteDetail.deal.dealImages.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Tags className="w-5 h-5" />
                      Deal Images
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {quoteDetail.deal.dealImages.slice(0, 6).map((image: string, idx: number) => (
                        <div key={idx} className="relative group">
                          <Image
                            src={image}
                            alt={`Deal image ${idx + 1}`}
                            width={200}
                            height={120}
                            className="w-full h-24 object-cover rounded-lg border border-blue-200"
                            style={{ objectFit: 'cover' }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Product Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {quoteDetail.product?.productName || 'N/A'}
                  </h3>
                  <p className="text-gray-600">
                    {quoteDetail.product?.description || 'No description available'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Chemical Name</p>
                    <p className="font-semibold text-gray-900">{quoteDetail.product?.chemicalName || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Trade Name</p>
                    <p className="font-semibold text-gray-900">{quoteDetail.product?.tradeName || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Country of Origin</p>
                    <p className="font-semibold text-gray-900">{quoteDetail.product?.countryOfOrigin || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Color</p>
                    <p className="font-semibold text-gray-900">{quoteDetail.product?.color || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-3 rounded-xl">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Quantity</p>
                  </div>
                  <p className="font-bold text-xl text-gray-900">
                    {quoteDetail.orderDetails?.quantity || 0} {quoteDetail.orderDetails?.uom || 'units'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Packaging</p>
                  </div>
                  <p className="font-bold text-xl text-gray-900">
                    {quoteDetail.orderDetails?.packagingSize || 'N/A'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-600">Delivery Date</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {quoteDetail.orderDetails?.deliveryDate 
                      ? new Date(quoteDetail.orderDetails.deliveryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      : 'N/A'}
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
                    {quoteDetail.orderDetails?.destination}, {quoteDetail.orderDetails?.country}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-gray-600" />
                    Incoterm
                  </h4>
                  <p className="text-gray-700 bg-gray-50 rounded-xl p-4">
                    {quoteDetail.orderDetails?.incoterm?.name || quoteDetail.orderDetails?.incoterm || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
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
                    <p className="font-semibold text-gray-900">{quoteDetail.buyer?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-600">Buyer</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{quoteDetail.buyer?.company || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{quoteDetail.buyer?.email || 'N/A'}</span>
                  </div>
                  {quoteDetail.buyer?.phone && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{quoteDetail.buyer.phone}</span>
                    </div>
                  )}
                  {quoteDetail.buyer?.address && (
                    <div className="flex items-start gap-3 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="text-sm">{quoteDetail.buyer.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

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
                {(() => { const timeline = getStatusTimeline(); return timeline.map((timelineItem, index) => (
                  <div key={timelineItem.status} className="flex items-center mb-4 last:mb-0">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        timelineItem.current 
                          ? 'border-blue-500 bg-blue-50' 
                          : timelineItem.completed 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300 bg-gray-50'
                      }`}>
                        {timelineItem.completed && !timelineItem.current ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          React.cloneElement(timelineItem.icon, {
                            className: `w-5 h-5 ${
                              timelineItem.current 
                                ? 'text-blue-600' 
                                : timelineItem.completed 
                                  ? 'text-white'
                                  : 'text-gray-400'
                            }`
                          })
                        )}
                        
                        {timelineItem.current && (
                          <div className="absolute -inset-1 rounded-full border-2 border-blue-300 animate-pulse"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className={`font-semibold ${
                          timelineItem.current 
                            ? 'text-blue-900' 
                            : timelineItem.completed 
                              ? 'text-gray-900'
                              : 'text-gray-500'
                        }`}>
                          {timelineItem.label}
                        </p>
                        {timelineItem.current && (
                          <p className="text-sm text-blue-600 font-medium">Current Status</p>
                        )}
                      </div>
                    </div>
                    
                    {index < timeline.length - 1 && (
                      <div className={`absolute left-5 mt-10 w-0.5 h-6 ${
                        timelineItem.completed ? 'bg-blue-500' : 'bg-gray-300'
                      }`} style={{ top: `${index * 64 + 40}px` }}></div>
                    )}
                  </div>
                )) })()}
              </div>

              {/* Timestamps */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Request Created</span>
                  <span className="font-medium text-gray-900">
                    {new Date(quoteDetail.createdAt).toLocaleDateString('en-US', {
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
                    {new Date(quoteDetail.updatedAt).toLocaleDateString('en-US', {
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

export default DealQuoteDetailPage;

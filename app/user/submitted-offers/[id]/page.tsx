"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import {
  ArrowLeft,
  Send,
  Package,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  MapPin,
  Truck,
  FileText,
  Mail,
  Phone,
  RefreshCcw,
  Copy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSubmittedOffersStore } from "@/stores/submittedOffersStore";
import { toast } from "sonner";

const SubmittedOfferDetail = () => {
  const router = useRouter();
  const params = useParams();
  const offerId = params.id as string;

  const { 
    detailedOffer, 
    loading, 
    fetchOfferDetail,
    clearOfferDetail
  } = useSubmittedOffersStore();

  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Fetch the detailed offer using the new API
    fetchOfferDetail(offerId);

    return () => {
      clearOfferDetail();
    };
  }, [offerId, fetchOfferDetail, clearOfferDetail]);

  // Get status info
  const getStatusInfo = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { 
          icon: Clock, 
          color: "bg-yellow-500", 
          textColor: "text-yellow-700", 
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200"
        };
      case "approved":
        return { 
          icon: CheckCircle, 
          color: "bg-green-500", 
          textColor: "text-green-700", 
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        };
      case "rejected":
        return { 
          icon: XCircle, 
          color: "bg-red-500", 
          textColor: "text-red-700", 
          bgColor: "bg-red-50",
          borderColor: "border-red-200"
        };
      case "completed":
        return { 
          icon: CheckCircle, 
          color: "bg-emerald-500", 
          textColor: "text-emerald-700", 
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200"
        };
      default:
        return { 
          icon: AlertCircle, 
          color: "bg-gray-500", 
          textColor: "text-gray-700", 
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200"
        };
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  // Handle image load error
  const handleImageError = (imageId: string) => {
    setImageLoading(prev => ({ ...prev, [imageId]: false }));
  };

  const handleImageLoad = (imageId: string) => {
    setImageLoading(prev => ({ ...prev, [imageId]: false }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
        <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 mx-auto max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl:max-w-6xl">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
              {/* Animated Loader */}
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-spin">
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-green-600 rounded-full animate-spin"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Send className="w-6 h-6 text-green-600 animate-pulse" />
                </div>
              </div>
              
              {/* Loading Text */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Offer Details</h3>
              <p className="text-gray-600 max-w-md">
                Please wait while we fetch the detailed information for this offer...
              </p>
              
              {/* Loading Progress Dots */}
              <div className="flex space-x-1 mt-4">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!detailedOffer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
        <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 mx-auto max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl:max-w-6xl">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Offer not found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md">
                The requested offer could not be found or loaded. Please try again or go back to the offers list.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => router.back()} 
                  variant="outline"
                  className="bg-white/80 border-gray-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
                <Button 
                  onClick={() => fetchOfferDetail(offerId)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(detailedOffer.status);
  const StatusIcon = statusInfo.icon;
  const totalValue = detailedOffer.pricePerUnit * detailedOffer.bulkOrderId.quantity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
      <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 p-3 sm:p-4 lg:p-6 xl:p-8 mb-4 sm:mb-6 lg:mb-8 mx-auto max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl:max-w-6xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-emerald-600/5 to-teal-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-200/15 to-green-200/15 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="bg-white/80 border-gray-200 hover:bg-white/90"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Offers
              </Button>
              
              <div className="relative flex-shrink-0">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 sm:p-4 rounded-2xl shadow-lg">
                  <Send className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                  Offer Details
                </h1>
                <p className="text-gray-600 text-base sm:text-lg mt-1 sm:mt-2 font-medium">
                  Submitted to {detailedOffer.buyer?.company}
                </p>
              </div>
              
              <Badge 
                className={`${statusInfo.bgColor} ${statusInfo.textColor} border-0 px-3 py-2 text-sm font-medium`}
              >
                <StatusIcon className="h-4 w-4 mr-2" />
                {detailedOffer.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden mx-auto max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl:max-w-6xl">
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {detailedOffer.bulkOrderId.product.productName}
                </h3>
                {detailedOffer.bulkOrderId.product.tradeName && (
                  <p className="text-gray-600 mb-2">
                    Trade Name: {detailedOffer.bulkOrderId.product.tradeName}
                  </p>
                )}
                {detailedOffer.bulkOrderId.product.chemicalName && (
                  <p className="text-gray-600 mb-2">
                    Chemical Name: {detailedOffer.bulkOrderId.product.chemicalName}
                  </p>
                )}
                {detailedOffer.bulkOrderId.product.description && (
                  <p className="text-gray-600 mb-2">
                    {detailedOffer.bulkOrderId.product.description}
                  </p>
                )}
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">City</label>
                  <p className="text-gray-900">{detailedOffer.orderDetails.deliveryLocation.city || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Country</label>
                  <p className="text-gray-900">{detailedOffer.orderDetails.deliveryLocation.country || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Delivery Date</label>
                  <p className="text-gray-900">{formatDate(detailedOffer.orderDetails.deliveryDate) || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Country of Origin</label>
                  <p className="text-gray-900">{detailedOffer.bulkOrderId.product.countryOfOrigin || "N/A"}</p>
                </div>
              </div>

              {/* Product Images */}
              {detailedOffer.bulkOrderId.product.productImages && detailedOffer.bulkOrderId.product.productImages.length > 0 && (
                <>
                  <div className="border-t border-gray-200 my-4"></div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Product Images</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {detailedOffer.bulkOrderId.product.productImages.map((image) => (
                        <div key={image._id} className="relative group">
                          <Image
                            src={image.fileUrl}
                            alt={`Product image`}
                            width={96}
                            height={96}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            onError={() => handleImageError(image._id)}
                            onLoad={() => handleImageLoad(image._id)}
                          />
                          {imageLoading[image._id] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Order Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Quantity</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {detailedOffer.orderDetails.quantity.toLocaleString()} {detailedOffer.orderDetails.uom}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Available Quantity</label>
                  <p className="text-gray-900">{detailedOffer.availableQuantity.toLocaleString()} {detailedOffer.orderDetails.uom}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Offer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Your Offer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Price Per Unit</label>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(detailedOffer.pricePerUnit)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Value</label>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(totalValue)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Delivery Time</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-400" />
                    {detailedOffer.deliveryTimeInDays} days
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Incoterm & Packaging</label>
                  <p className="text-gray-900">{detailedOffer.incotermAndPackaging}</p>
                </div>
              </div>

              {detailedOffer.message && (
                <>
                  <div className="border-t border-gray-200 my-4"></div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Your Message</label>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-gray-700">{detailedOffer.message}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card className={`${statusInfo.borderColor} border-2`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon className={`h-5 w-5 ${statusInfo.textColor}`} />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`${statusInfo.bgColor} ${statusInfo.textColor} p-4 rounded-lg text-center`}>
                <p className="font-semibold text-lg">{detailedOffer.status}</p>
                <p className="text-sm opacity-75 mt-1">
                  Submitted on {formatDate(detailedOffer.createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Buyer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                Buyer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Company</label>
                <p className="font-semibold text-gray-900">{detailedOffer.buyer.company}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Contact Person</label>
                <p className="text-gray-900">
                  {detailedOffer.buyer.name}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900 flex-1">{detailedOffer.buyer.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(detailedOffer.buyer.email, "Email")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {detailedOffer.buyer.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900 flex-1">{detailedOffer.buyer.phone}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(detailedOffer.buyer.phone.toString(), "Phone")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">Location</label>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="text-gray-900">
                    {[
                      detailedOffer.orderDetails.deliveryLocation.city,
                      detailedOffer.orderDetails.deliveryLocation.country
                    ].filter(Boolean).join(", ")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Timeline with Status History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Status Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-900">Offer Submitted</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(detailedOffer.createdAt)}
                  </p>
                </div>
              </div>
              
              {/* Status Timeline from API */}
              {detailedOffer.statusTimeline && detailedOffer.statusTimeline.map((timeline) => (
                <div key={timeline._id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    timeline.status === 'approved' ? 'bg-green-600' : 
                    timeline.status === 'rejected' ? 'bg-red-600' : 
                    timeline.status === 'pending' ? 'bg-yellow-600' : 'bg-gray-600'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{timeline.status}</p>
                    {timeline.message && (
                      <p className="text-sm text-gray-600 mb-1">{timeline.message}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {formatDate(timeline.date)} • Updated by {timeline.updatedBy}
                    </p>
                  </div>
                </div>
              ))}

              {detailedOffer.updatedAt !== detailedOffer.createdAt && !detailedOffer.statusTimeline?.length && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Last Updated</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(detailedOffer.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmittedOfferDetail;

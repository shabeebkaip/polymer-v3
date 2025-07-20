"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductRequestDetailStore } from '@/stores/user';
import { Button } from "@/components/ui/button";
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
  Truck,
  Activity,
  CalendarDays,
  Hash,
  Scale,
  MapPinHouse,
  MessageSquare,
  Eye,
  Download,
  ChevronRight,
  Loader2
} from "lucide-react";
import Image from 'next/image';

const ProductRequestDetail = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    productRequestDetail,
    supplierOffers,
    loading,
    error,
    fetchProductRequestDetail,
    clearProductRequestDetail
  } = useProductRequestDetailStore();

  useEffect(() => {
    if (id) {
      fetchProductRequestDetail(id);
    }
    return () => {
      clearProductRequestDetail();
    };
  }, [id, fetchProductRequestDetail, clearProductRequestDetail]);

  // Status badge
  const getStatusBadge = (status: string, isSellerStatus = false) => {
    const prefix = isSellerStatus ? "Seller: " : "";
    switch (status) {
      case "pending": return { 
        class: "bg-amber-100 text-amber-700 border border-amber-200", 
        text: `${prefix}Pending`,
        icon: Clock
      };
      case "accepted": return { 
        class: "bg-emerald-100 text-emerald-700 border border-emerald-200", 
        text: `${prefix}Accepted`,
        icon: CheckCircle
      };
      case "in_progress": return { 
        class: "bg-teal-100 text-teal-700 border border-teal-200", 
        text: `${prefix}In Progress`,
        icon: Activity
      };
      case "shipped": return { 
        class: "bg-green-100 text-green-700 border border-green-200", 
        text: `${prefix}Shipped`,
        icon: Truck
      };
      case "delivered": return { 
        class: "bg-emerald-100 text-emerald-700 border border-emerald-200", 
        text: `${prefix}Delivered`,
        icon: Package
      };
      case "completed": return { 
        class: "bg-green-100 text-green-700 border border-green-200", 
        text: `${prefix}Completed`,
        icon: CheckCircle
      };
      case "approved": return { 
        class: "bg-green-100 text-green-700 border border-green-200", 
        text: `${prefix}Approved`,
        icon: CheckCircle
      };
      case "rejected": return { 
        class: "bg-red-100 text-red-700 border border-red-200", 
        text: `${prefix}Rejected`,
        icon: XCircle
      };
      case "cancelled": return { 
        class: "bg-gray-100 text-gray-700 border border-gray-200", 
        text: `${prefix}Cancelled`,
        icon: XCircle
      };
      default: return { 
        class: "bg-gray-100 text-gray-700 border border-gray-200", 
        text: `${prefix}Unknown`,
        icon: AlertCircle
      };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
          <div className="flex items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <span className="text-xl font-semibold text-gray-700">Loading product request details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !productRequestDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-red-200/50 p-8 max-w-md">
          <div className="flex items-center gap-4 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <span className="text-xl font-semibold text-red-700">Error Loading Request</span>
          </div>
          <p className="text-gray-600 mb-6">{error || "Product request not found"}</p>
          <Button 
            onClick={() => router.push('/user/product-requests')}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Product Requests
          </Button>
        </div>
      </div>
    );
  }

  const adminStatus = getStatusBadge(productRequestDetail.status);
  const sellerStatusBadge = getStatusBadge(productRequestDetail.sellerStatus, true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
      <div className="container mx-auto px-6 py-8 ">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/user/product-requests')}
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Requests
          </Button>
          <div className="flex items-center gap-2 text-gray-500">
            <span>Product Requests</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-green-700 font-semibold">Request #{productRequestDetail._id.slice(-8).toUpperCase()}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Request Overview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                  Product Request Details
                </h1>
                <div className="flex gap-3">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${adminStatus.class}`}>
                    <adminStatus.icon className="w-4 h-4" />
                    {adminStatus.text}
                  </span>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${sellerStatusBadge.class}`}>
                    <sellerStatusBadge.icon className="w-4 h-4" />
                    {sellerStatusBadge.text}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Hash className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Request ID</p>
                    <p className="font-semibold text-gray-900">#{productRequestDetail._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-3 rounded-xl">
                    <CalendarDays className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created On</p>
                    <p className="font-semibold text-gray-900">{formatDate(productRequestDetail.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-3 rounded-xl">
                    <Scale className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quantity Required</p>
                    <p className="font-semibold text-gray-900">{productRequestDetail.quantity.toLocaleString()} {productRequestDetail.uom}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivery Date</p>
                    <p className="font-semibold text-gray-900">{formatDateOnly(productRequestDetail.delivery_date)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Package className="w-6 h-6 text-green-600" />
                Product Information
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Image */}
                <div>
                  {productRequestDetail.product.productImages?.length > 0 && (
                    <div className="relative">
                      <Image
                        src={productRequestDetail.product.productImages[0].fileUrl}
                        alt={productRequestDetail.product.productName}
                        width={600}
                        height={256}
                        className="w-full h-64 object-cover rounded-xl border border-gray-200"
                        priority
                      />
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm">
                        {productRequestDetail.product.productImages.length} image{productRequestDetail.product.productImages.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{productRequestDetail.product.productName}</h3>
                    <p className="text-green-600 font-semibold">{productRequestDetail.product.tradeName}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Chemical Name</p>
                      <p className="font-semibold text-gray-900">{productRequestDetail.product.chemicalName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Manufacturing Method</p>
                      <p className="font-semibold text-gray-900">{productRequestDetail.product.manufacturingMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Country of Origin</p>
                      <p className="font-semibold text-gray-900">{productRequestDetail.product.countryOfOrigin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Color</p>
                      <p className="font-semibold text-gray-900 capitalize">{productRequestDetail.product.color}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Description</p>
                    <p className="text-gray-900">{productRequestDetail.product.description}</p>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-600 mb-1">Density</p>
                    <p className="font-semibold text-gray-900">{productRequestDetail.product.density}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-600 mb-1">MFI (g/10 min)</p>
                    <p className="font-semibold text-gray-900">{productRequestDetail.product.mfi}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-600 mb-1">Tensile Strength</p>
                    <p className="font-semibold text-gray-900">{productRequestDetail.product.tensileStrength}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-600 mb-1">Elongation at Break</p>
                    <p className="font-semibold text-gray-900">{productRequestDetail.product.elongationAtBreak}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-600 mb-1">Shore Hardness</p>
                    <p className="font-semibold text-gray-900">{productRequestDetail.product.shoreHardness}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-600 mb-1">Water Absorption</p>
                    <p className="font-semibold text-gray-900">{productRequestDetail.product.waterAbsorption}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery & Location Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Truck className="w-6 h-6 text-green-600" />
                Delivery & Location Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Destination</p>
                    <p className="font-semibold text-gray-900">{productRequestDetail.destination}</p>
                    <p className="text-sm text-gray-600 mt-1">{productRequestDetail.city}, {productRequestDetail.country}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-3 rounded-xl">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Required Delivery Date</p>
                    <p className="font-semibold text-gray-900">{formatDateOnly(productRequestDetail.delivery_date)}</p>
                  </div>
                </div>
              </div>

              {productRequestDetail.message && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="bg-teal-100 p-3 rounded-xl">
                      <MessageSquare className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">Additional Message</p>
                      <p className="text-gray-900 bg-gray-50 p-4 rounded-xl">{productRequestDetail.message}</p>
                    </div>
                  </div>
                </div>
              )}

              {productRequestDetail.request_document && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Attached Document</p>
                      <p className="font-semibold text-gray-900">{productRequestDetail.request_document}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Supplier Offers */}
            {supplierOffers && supplierOffers.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-green-600" />
                    Supplier Offers
                  </h2>
                  <div className="bg-green-100 px-4 py-2 rounded-full">
                    <span className="text-green-700 font-semibold">{supplierOffers.length} Offer{supplierOffers.length > 1 ? 's' : ''} Received</span>
                  </div>
                </div>

                {/* Offers Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Pending Offers</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {supplierOffers.filter(offer => offer.status === 'pending').length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Approved Offers</p>
                    <p className="text-2xl font-bold text-green-600">
                      {supplierOffers.filter(offer => offer.status === 'approved').length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Best Price</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${Math.min(...supplierOffers.map(offer => offer.pricePerUnit)).toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {supplierOffers.map((offer) => {
                    const offerStatus = getStatusBadge(offer.status);
                    const totalCost = offer.pricePerUnit * productRequestDetail.quantity;
                    
                    return (
                      <div key={offer._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        {/* Offer Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                              <Building2 className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">
                                {offer.supplierId.firstName} {offer.supplierId.lastName}
                              </h4>
                              <p className="text-sm text-gray-600">{offer.supplierId.company}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${offerStatus.class}`}>
                            <offerStatus.icon className="w-3 h-3" />
                            {offerStatus.text}
                          </span>
                        </div>

                        {/* Offer Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-green-600 font-medium mb-1">Price per Unit</p>
                            <p className="font-bold text-gray-900">${offer.pricePerUnit.toFixed(2)}</p>
                          </div>
                          <div className="bg-emerald-50 p-3 rounded-lg">
                            <p className="text-xs text-emerald-600 font-medium mb-1">Total Cost</p>
                            <p className="font-bold text-gray-900">${totalCost.toLocaleString()}</p>
                          </div>
                          <div className="bg-teal-50 p-3 rounded-lg">
                            <p className="text-xs text-teal-600 font-medium mb-1">Delivery Time</p>
                            <p className="font-bold text-gray-900">{offer.deliveryTimeInDays} days</p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-xs text-blue-600 font-medium mb-1">Available Qty</p>
                            <p className="font-bold text-gray-900">{offer.availableQuantity.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Additional Details */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Package className="w-4 h-4 text-gray-500 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">Incoterm & Packaging</p>
                              <p className="text-gray-600">{offer.incotermAndPackaging}</p>
                            </div>
                          </div>
                          
                          {offer.message && (
                            <div className="flex items-start gap-3">
                              <MessageSquare className="w-4 h-4 text-gray-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">Supplier Message</p>
                                <p className="text-gray-600">{offer.message}</p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-700">Contact</p>
                              <p className="text-gray-600">{offer.supplierId.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Status Messages */}
                        {offer.statusMessage && offer.statusMessage.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-2">Status History</p>
                            <div className="space-y-2">
                              {offer.statusMessage.slice(-3).map((statusMsg) => (
                                <div key={statusMsg._id} className="bg-gray-50 p-2 rounded text-xs">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium capitalize">{statusMsg.status}</span>
                                    <span className="text-gray-500">{formatDate(statusMsg.date)}</span>
                                  </div>
                                  <p className="text-gray-600 mt-1">{statusMsg.message}</p>
                                  <p className="text-gray-500 text-xs">Updated by: {statusMsg.updatedBy}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        {offer.status === 'pending' && (
                          <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Accept Offer
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject Offer
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No Offers State */}
            {supplierOffers && supplierOffers.length === 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
                <div className="text-center py-8">
                  <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Supplier Offers Yet</h3>
                  <p className="text-gray-500 mb-4">
                    Your request is being reviewed by suppliers. You&apos;ll see offers here once they respond.
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm text-green-600">
                    <Clock className="w-4 h-4" />
                    Waiting for supplier responses...
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Supplier Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Building2 className="w-5 h-5 text-green-600" />
                Supplier Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {productRequestDetail.product.createdBy.firstName} {productRequestDetail.product.createdBy.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{productRequestDetail.product.createdBy.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <Mail className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{productRequestDetail.product.createdBy.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-2 rounded-lg">
                    <Phone className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">{productRequestDetail.product.createdBy.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <MapPinHouse className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold text-gray-900">{productRequestDetail.product.createdBy.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buyer Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <User className="w-5 h-5 text-green-600" />
                Buyer Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {productRequestDetail.user.firstName} {productRequestDetail.user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{productRequestDetail.user.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <Mail className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{productRequestDetail.user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-2 rounded-lg">
                    <Phone className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">{productRequestDetail.user.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <MapPinHouse className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold text-gray-900">{productRequestDetail.user.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Tracking */}
            {productRequestDetail.statusTracking && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Activity className="w-5 h-5 text-green-600" />
                  Status Tracking
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-600">Admin Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(productRequestDetail.statusTracking.adminStatus).class}`}>
                      {getStatusBadge(productRequestDetail.statusTracking.adminStatus).text}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-600">Seller Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(productRequestDetail.statusTracking.sellerStatus).class}`}>
                      {getStatusBadge(productRequestDetail.statusTracking.sellerStatus).text}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-600">Last Updated</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatDate(productRequestDetail.statusTracking.lastUpdate)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm font-medium text-gray-600">Total Updates</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {productRequestDetail.statusTracking.totalUpdates}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => router.push(`/products/${productRequestDetail.product._id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Product Details
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => router.push('/user/product-requests')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to All Requests
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRequestDetail;
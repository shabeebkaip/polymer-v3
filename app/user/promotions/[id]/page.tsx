"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePromotionsStore } from '@/stores/promotionsStore';
import { getStatusConfig } from '@/lib/config/status.config';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  ArrowLeft,
  Package,
  DollarSign,
  Calendar,
  Eye,
  Edit,
  Zap,
  Activity,
  XCircle,
  Clock,
  CheckCircle,
  Image as ImageIcon,
  Award,
  Tag
} from 'lucide-react';
import Image from 'next/image';
import { DealQuoteRequestCount } from '@/components/user/deal-quote-requests';

const PromotionDetail = () => {
  const params = useParams();
  const router = useRouter();
  const promotionId = params?.id as string;
  
  const {
    promotionDetail,
    detailLoading,
    detailError,
    fetchPromotionDetail,
    clearPromotionDetail
  } = usePromotionsStore();

  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (promotionId) {
      fetchPromotionDetail(promotionId);
    }
    
    return () => {
      clearPromotionDetail();
    };
  }, [promotionId, fetchPromotionDetail, clearPromotionDetail]);

  // Calculate discount percentage
  const getDiscountInfo = () => {
    if (!promotionDetail?.product?.price || !promotionDetail?.offerPrice) {
      return null;
    }
    
    const originalPrice = promotionDetail.product.price;
    const offerPrice = promotionDetail.offerPrice;
    
    if (originalPrice <= offerPrice) {
      return null;
    }
    
    const discountAmount = originalPrice - offerPrice;
    const discountPercentage = (discountAmount / originalPrice) * 100;
    
    return {
      amount: discountAmount,
      percentage: discountPercentage
    };
  };

  const handleImageError = (imageId: string) => {
    setImageLoading(prev => ({ ...prev, [imageId]: false }));
  };

  const handleImageLoad = (imageId: string) => {
    setImageLoading(prev => ({ ...prev, [imageId]: false }));
  };


  // Loading state
  if (detailLoading) {
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

  // Error state
  if (detailError || !promotionDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Error Loading Details</h3>
          <p className="text-sm text-gray-600 mb-4">{detailError || "Promotion details not found"}</p>
          <button
            onClick={() => router.push('/user/promotions')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(promotionDetail.status);
  const StatusIcon = statusConfig.icon;
  const discountInfo = getDiscountInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <button
            onClick={() => router.push('/user/promotions')}
            className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2.5 rounded-lg">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Promotion Details
                </h1>
                <p className="text-gray-600 text-sm mt-0.5">
                  Deal ID: #{promotionId.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}>
                <StatusIcon className="w-5 h-5" />
                {statusConfig.text}
              </span>
              {promotionDetail.isExpired && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700 border border-red-300">
                  <XCircle className="w-4 h-4" />
                  Expired
                </span>
              )}
              <button 
                onClick={() => router.push(`/user/promotions/${promotionId}/edit`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="xl:col-span-2 space-y-6">
            {/* Product Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Product Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {promotionDetail.product.productName}
                  </h3>
                  {promotionDetail.product.description && (
                    <p className="text-sm text-gray-600">{promotionDetail.product.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {promotionDetail.product.chemicalName && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Chemical Name</p>
                      <p className="text-sm font-medium text-gray-900">{promotionDetail.product.chemicalName}</p>
                    </div>
                  )}
                  {promotionDetail.product.tradeName && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Trade Name</p>
                      <p className="text-sm font-medium text-gray-900">{promotionDetail.product.tradeName}</p>
                    </div>
                  )}
                  {promotionDetail.product.color && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Color</p>
                      <p className="text-sm font-medium text-gray-900">{promotionDetail.product.color}</p>
                    </div>
                  )}
                  {promotionDetail.product.countryOfOrigin && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Country of Origin</p>
                      <p className="text-sm font-medium text-gray-900">{promotionDetail.product.countryOfOrigin}</p>
                    </div>
                  )}
                  {promotionDetail.product.manufacturingMethod && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-600 mb-1">Manufacturing Method</p>
                      <p className="text-sm font-medium text-gray-900">{promotionDetail.product.manufacturingMethod}</p>
                    </div>
                  )}
                  {promotionDetail.product.specifications?.density && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Density</p>
                      <p className="text-sm font-medium text-gray-900">{promotionDetail.product.specifications.density}</p>
                    </div>
                  )}
                  {promotionDetail.product.specifications?.mfi && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">MFI (g/10 min)</p>
                      <p className="text-sm font-medium text-gray-900">{promotionDetail.product.specifications.mfi}</p>
                    </div>
                  )}
                  {promotionDetail.product.specifications?.tensileStrength && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Tensile Strength</p>
                      <p className="text-sm font-medium text-gray-900">{promotionDetail.product.specifications.tensileStrength}</p>
                    </div>
                  )}
                </div>

                {/* Product Images */}
                {promotionDetail.product.productImages && promotionDetail.product.productImages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Product Images</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {promotionDetail.product.productImages.slice(0, 4).map((image, index) => (
                        <div key={image._id || index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          {imageLoading[image._id] && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                              <ImageIcon className="w-8 h-8 text-gray-400 animate-pulse" />
                            </div>
                          )}
                          <Image
                            src={image.fileUrl}
                            alt={image.name || `Product image ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                            onLoad={() => handleImageLoad(image._id)}
                            onError={() => handleImageError(image._id)}
                            priority={index === 0}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Pricing Information</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-xs text-green-600 mb-1">Promotional Price</p>
                    <p className="text-2xl font-bold text-green-800">
                      {formatCurrency(promotionDetail.offerPrice)}
                    </p>
                  </div>
                  
                  {promotionDetail.product.price && (
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Original Price</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(promotionDetail.product.price)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Discount Information */}
                {discountInfo && (
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-orange-600" />
                      <h4 className="font-semibold text-orange-800">Savings</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-orange-600">Discount Amount</p>
                        <p className="text-lg font-bold text-orange-800">
                          {formatCurrency(discountInfo.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-orange-600">Discount Percentage</p>
                        <p className="text-lg font-bold text-orange-800">
                          {discountInfo.percentage.toFixed(1)}% OFF
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Stock Information */}
                {promotionDetail.product.stock && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">Available Stock</span>
                    </div>
                    <p className="text-lg font-bold text-blue-800 mt-1">
                      {promotionDetail.product.stock.toLocaleString()} units
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Tracking */}
            {promotionDetail.statusTracking && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Status Tracking</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Admin Status</p>
                      <p className="text-sm font-bold text-gray-900 capitalize">
                        {promotionDetail.statusTracking.adminStatus}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Total Requests</p>
                      <p className="text-sm font-bold text-gray-900">
                        {promotionDetail.statusTracking.totalRequests}
                      </p>
                    </div>
                  </div>

                  {/* Request Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Request Breakdown</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="bg-white rounded p-2 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-0.5">Pending</p>
                        <p className="text-lg font-bold text-gray-900">
                          {promotionDetail.statusTracking.requestBreakdown.pending}
                        </p>
                      </div>
                      <div className="bg-white rounded p-2 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-0.5">Accepted</p>
                        <p className="text-lg font-bold text-gray-900">
                          {promotionDetail.statusTracking.requestBreakdown.accepted}
                        </p>
                      </div>
                      <div className="bg-white rounded p-2 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-0.5">Rejected</p>
                        <p className="text-lg font-bold text-gray-900">
                          {promotionDetail.statusTracking.requestBreakdown.rejected}
                        </p>
                      </div>
                      <div className="bg-white rounded p-2 border border-gray-200">
                        <p className="text-xs text-gray-600 mb-0.5">Completed</p>
                        <p className="text-lg font-bold text-gray-900">
                          {promotionDetail.statusTracking.requestBreakdown.completed}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Last Update</span>
                    </div>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatDate(promotionDetail.statusTracking.lastUpdate)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {promotionDetail.adminNote && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Admin Notes</h2>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-800">{promotionDetail.adminNote}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Promotion Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Promotion Timeline</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-xs text-gray-600">{formatDate(promotionDetail.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-xs text-gray-600">{formatDate(promotionDetail.updatedAt)}</p>
                  </div>
                </div>

                {promotionDetail.validUntil && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Valid Until</p>
                      <p className="text-xs text-gray-600">{formatDate(promotionDetail.validUntil)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quote Requests */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Quote Requests</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <DealQuoteRequestCount dealId={promotionId} className="w-full justify-center" />
                </div>
                <button
                  onClick={() => router.push(`/user/promotions/${promotionId}/quote-requests`)}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View All Requests
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Active</span>
                  <span className="text-sm font-medium text-gray-900">
                    {promotionDetail.summary?.isActive ?? promotionDetail.isActive ? 'Yes' : 'No'}
                  </span>
                </div>
                {promotionDetail.isExpired !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Expired</span>
                    <span className={`text-sm font-medium ${promotionDetail.isExpired ? 'text-red-700' : 'text-green-700'}`}>
                      {promotionDetail.isExpired ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}
                {promotionDetail.summary && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Total Requests</span>
                    <span className="text-sm font-medium text-gray-900">
                      {promotionDetail.summary.totalQuoteRequests}
                    </span>
                  </div>
                )}
                {promotionDetail.minimumQuantity && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Min. Quantity</span>
                    <span className="text-sm font-medium text-gray-900">
                      {promotionDetail.minimumQuantity}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetail;
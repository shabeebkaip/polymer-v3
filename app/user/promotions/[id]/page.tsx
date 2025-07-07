"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePromotionsStore } from '@/stores/promotionsStore';
import {
  ArrowLeft,
  Package,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Building2,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit,
  Star,
  Award,
  Zap,
  Activity,
  Image as ImageIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';

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

  // Status configuration
  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'active':
        return {
          icon: CheckCircle,
          text: 'Active',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'pending':
        return {
          icon: Clock,
          text: 'Pending Review',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200'
        };
      case 'rejected':
        return {
          icon: XCircle,
          text: 'Rejected',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: AlertTriangle,
          text: status || 'Unknown',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200'
        };
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
      minute: '2-digit'
    });
  };

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
        <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 p-3 sm:p-4 lg:p-6 xl:p-8 mb-4 sm:mb-6 lg:mb-8 mx-auto max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl:max-w-6xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-green-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Promotion Details</h3>
                <p className="text-gray-600 max-w-md">
                  Please wait while we fetch the detailed information for this promotion...
                </p>
                
                {/* Loading Progress Dots */}
                <div className="flex space-x-1 mt-4 justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (detailError || !promotionDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
        <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 p-3 sm:p-4 lg:p-6 xl:p-8 mb-4 sm:mb-6 lg:mb-8 mx-auto max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl:max-w-6xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {detailError ? 'Error Loading Promotion' : 'Promotion Not Found'}
                </h3>
                <p className="text-gray-600 max-w-md mb-6">
                  {detailError || 'The promotion you are looking for could not be found or may have been removed.'}
                </p>
                <button
                  onClick={() => router.push('/user/promotions')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Promotions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(promotionDetail.status);
  const StatusIcon = statusConfig.icon;
  const discountInfo = getDiscountInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
      <div className="w-full px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 p-3 sm:p-4 lg:p-6 xl:p-8 mb-4 sm:mb-6 lg:mb-8 mx-auto max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl:max-w-6xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/10 to-emerald-600/10 rounded-full -translate-y-32 translate-x-32"></div>
          
          <div className="relative">
            {/* Back Button */}
            <button
              onClick={() => router.push('/user/promotions')}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200 font-medium mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Promotions
            </button>

            {/* Title Section */}
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                  Promotion Details
                </h1>
                <p className="text-gray-600 text-lg mt-2 font-medium">
                  {promotionDetail.product.productName}
                </p>
                
                {/* Status Badge */}
                <div className="mt-4">
                  <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border px-3 py-1 text-sm font-semibold`}>
                    <StatusIcon className="w-4 h-4 mr-2" />
                    {statusConfig.text}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-xl transition-colors duration-200 font-medium flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button 
                  onClick={() => router.push(`/user/promotions/${promotionId}/edit`)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl transition-colors duration-200 font-medium flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="mx-auto max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl:max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Product Information */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Package className="h-5 w-5" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {promotionDetail.product.productName}
                  </h3>
                  {promotionDetail.product.tradeName && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Trade Name:</span> {promotionDetail.product.tradeName}
                    </p>
                  )}
                  {promotionDetail.product.chemicalName && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Chemical Name:</span> {promotionDetail.product.chemicalName}
                    </p>
                  )}
                  {promotionDetail.product.description && (
                    <p className="text-gray-600 mb-4">
                      {promotionDetail.product.description}
                    </p>
                  )}
                </div>

                {/* Product Images */}
                {promotionDetail.product.productImages && promotionDetail.product.productImages.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Product Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {promotionDetail.product.productImages.map((image, index) => (
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
                            // onLoadStart is not supported by next/image, so we skip it
                            priority={index === 0}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Specifications */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Product Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {promotionDetail.product.countryOfOrigin && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-600">Country of Origin</span>
                        <p className="text-gray-900 font-medium">{promotionDetail.product.countryOfOrigin}</p>
                      </div>
                    )}
                    {promotionDetail.product.color && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-600">Color</span>
                        <p className="text-gray-900 font-medium">{promotionDetail.product.color}</p>
                      </div>
                    )}
                    {promotionDetail.product.specifications?.density && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-600">Density</span>
                        <p className="text-gray-900 font-medium">{promotionDetail.product.specifications.density}</p>
                      </div>
                    )}
                    {promotionDetail.product.specifications?.mfi && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-600">MFI</span>
                        <p className="text-gray-900 font-medium">{promotionDetail.product.specifications.mfi}</p>
                      </div>
                    )}
                    {promotionDetail.product.specifications?.tensileStrength && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-600">Tensile Strength</span>
                        <p className="text-gray-900 font-medium">{promotionDetail.product.specifications.tensileStrength}</p>
                      </div>
                    )}
                    {promotionDetail.product.manufacturingMethod && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-600">Manufacturing Method</span>
                        <p className="text-gray-900 font-medium">{promotionDetail.product.manufacturingMethod}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Information */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <DollarSign className="h-5 w-5" />
                  Pricing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <label className="text-sm font-medium text-green-700 mb-2 block">Promotional Price</label>
                    <p className="text-3xl font-bold text-green-800">
                      {formatCurrency(promotionDetail.offerPrice)}
                    </p>
                  </div>
                  
                  {promotionDetail.product.price && (
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <label className="text-sm font-medium text-gray-600 mb-2 block">Original Price</label>
                      <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(promotionDetail.product.price)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Discount Information */}
                {discountInfo && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-5 h-5 text-orange-600" />
                      <h4 className="font-semibold text-orange-800">Savings</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-orange-600">Discount Amount</p>
                        <p className="text-xl font-bold text-orange-800">
                          {formatCurrency(discountInfo.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-orange-600">Discount Percentage</p>
                        <p className="text-xl font-bold text-orange-800">
                          {discountInfo.percentage.toFixed(1)}% OFF
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Stock Information */}
                {promotionDetail.product.stock && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">Available Stock</span>
                    </div>
                    <p className="text-lg font-bold text-blue-800 mt-1">
                      {promotionDetail.product.stock.toLocaleString()} units
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Admin Notes */}
            {promotionDetail.adminNote && (
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Award className="h-5 w-5" />
                    Admin Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-blue-800">{promotionDetail.adminNote}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Seller Information */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Building2 className="h-5 w-5" />
                  Seller Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {promotionDetail.seller.name}
                    </h4>
                    <p className="text-sm text-gray-600">{promotionDetail.seller.company}</p>
                  </div>
                  {promotionDetail.seller.isVerified && (
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{promotionDetail.seller.email}</span>
                  </div>
                  {promotionDetail.seller.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{String(promotionDetail.seller.phone)}</span>
                    </div>
                  )}
                  {promotionDetail.seller.address?.full && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{promotionDetail.seller.address.full}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Promotion Timeline */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Calendar className="h-5 w-5" />
                  Promotion Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Created</p>
                      <p className="text-sm text-gray-600">{formatDate(promotionDetail.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-sm text-gray-600">{formatDate(promotionDetail.updatedAt)}</p>
                    </div>
                  </div>

                  {promotionDetail.validUntil && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Valid Until</p>
                        <p className="text-sm text-gray-600">{formatDate(promotionDetail.validUntil)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Star className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Status</span>
                    <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} text-xs`}>
                      {statusConfig.text}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Active</span>
                    <span className="text-sm font-medium text-green-800">
                      {promotionDetail.isActive ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {promotionDetail.minimumQuantity && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">Min. Quantity</span>
                      <span className="text-sm font-medium text-green-800">
                        {promotionDetail.minimumQuantity}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetail;
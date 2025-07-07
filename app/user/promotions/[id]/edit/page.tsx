"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { updatePromotion } from "@/apiServices/user";
import { usePromotionsStore } from '@/stores/promotionsStore';
import { 
  ArrowLeft, 
  Package, 
  DollarSign, 
  Save, 
  Loader2,
  CheckCircle,
  AlertTriangle,
  Edit
} from 'lucide-react';

const EditPromotion = () => {
  const router = useRouter();
  const params = useParams();
  const promotionId = params?.id as string;
  
  const {
    promotionDetail,
    detailLoading,
    detailError,
    fetchPromotionDetail,
    clearPromotionDetail
  } = usePromotionsStore();
  
  const [formData, setFormData] = useState({
    offerPrice: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch promotion details
  useEffect(() => {
    if (promotionId) {
      fetchPromotionDetail(promotionId);
    }
    
    return () => {
      clearPromotionDetail();
    };
  }, [promotionId, fetchPromotionDetail, clearPromotionDetail]);

  // Populate form when promotion detail is loaded
  useEffect(() => {
    if (promotionDetail) {
      setFormData({
        offerPrice: promotionDetail.offerPrice.toString()
      });
    }
  }, [promotionDetail]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear previous errors when user starts typing
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.offerPrice || !promotionId) {
      setError('Please enter a valid offer price');
      return;
    }

    const offerPrice = parseFloat(formData.offerPrice);
    if (offerPrice <= 0) {
      setError('Offer price must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await updatePromotion(promotionId, offerPrice);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/user/promotions');
      }, 2000);
      
    } catch {
      setError('Failed to update promotion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getDiscountInfo = () => {
    if (!promotionDetail?.product?.price || !formData.offerPrice) {
      return null;
    }
    
    const originalPrice = promotionDetail.product.price;
    const offerPrice = parseFloat(formData.offerPrice);
    
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

  // Loading state for promotion details
  if (detailLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-2xl p-6 h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state for promotion details
  if (detailError || !promotionDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {detailError ? 'Error Loading Promotion' : 'Promotion Not Found'}
              </h3>
              <p className="text-gray-600 max-w-md mb-6 mx-auto">
                {detailError || 'The promotion you are trying to edit could not be found.'}
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
    );
  }

  const discountInfo = getDiscountInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-white/90 to-green-50/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5"></div>
          <div className="relative p-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200 font-medium mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Edit className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                  Edit Promotion
                </h1>
                <p className="text-gray-600 text-lg mt-2 font-medium">
                  Update your promotional offer for &quot;{promotionDetail.product.productName}&quot;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 text-green-800">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">Promotion updated successfully!</span>
            </div>
            <p className="text-green-700 mt-2">Redirecting to promotions list...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 text-red-800">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-semibold">Error updating promotion</span>
            </div>
            <p className="text-red-700 mt-2">{error}</p>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
          {/* Product Information */}
          <div className="mb-8 p-6 bg-gray-50/50 rounded-xl border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-600" />
              Product Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Product Name</label>
                <div className="bg-white/70 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 font-medium">
                  {promotionDetail.product.productName}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Current Status</label>
                <div className="bg-white/70 border border-gray-300 rounded-xl px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    promotionDetail.status === 'approved' || promotionDetail.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : promotionDetail.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {promotionDetail.status.charAt(0).toUpperCase() + promotionDetail.status.slice(1)}
                  </span>
                </div>
              </div>
              {promotionDetail.product.price && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Original Price</label>
                  <div className="bg-white/70 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 font-medium">
                    {formatCurrency(promotionDetail.product.price)}
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">Current Offer Price</label>
                <div className="bg-white/70 border border-gray-300 rounded-xl px-4 py-3 text-green-700 font-bold">
                  {formatCurrency(promotionDetail.offerPrice)}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Offer Price */}
            <div>
              <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-700 mb-2">
                New Offer Price *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  id="offerPrice"
                  name="offerPrice"
                  value={formData.offerPrice}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  placeholder="Enter your new promotional price"
                  className="w-full pl-12 pr-4 py-3 bg-white/70 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
              </div>
              {promotionDetail.product.price && formData.offerPrice && (
                <div className="mt-2 text-sm">
                  {parseFloat(formData.offerPrice) < promotionDetail.product.price ? (
                    <span className="text-green-600 font-medium">
                      Discount: {formatCurrency(promotionDetail.product.price - parseFloat(formData.offerPrice))} 
                      ({(((promotionDetail.product.price - parseFloat(formData.offerPrice)) / promotionDetail.product.price) * 100).toFixed(1)}% off)
                    </span>
                  ) : parseFloat(formData.offerPrice) === promotionDetail.product.price ? (
                    <span className="text-yellow-600 font-medium">
                      Price is same as original price (no discount)
                    </span>
                  ) : (
                    <span className="text-orange-600 font-medium">
                      Price is higher than original price
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Discount Information Card */}
            {discountInfo && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-3">Savings Preview</h4>
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

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200/60">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.offerPrice}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? 'Updating...' : 'Update Promotion'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-green-50/50 border border-green-200/50 rounded-2xl p-6 mt-8">
          <h3 className="font-semibold text-green-900 mb-2">Important Information</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Changes to your promotion will be submitted for admin review</li>
            <li>• The updated promotion will be visible to buyers once approved</li>
            <li>• Consider market prices when setting your offer price</li>
            <li>• Lower prices typically attract more customers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditPromotion;
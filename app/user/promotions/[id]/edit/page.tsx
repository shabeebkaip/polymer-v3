"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updatePromotion } from "@/apiServices/user";
import { usePromotionsStore } from '@/stores/promotionsStore';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Package, 
  DollarSign, 
  Save, 
  Loader2,
  CheckCircle,
  AlertTriangle,
  Edit,
  Calendar as CalendarIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Zod validation schema
const promotionSchema = z.object({
  offerPrice: z.string()
    .min(1, 'Offer price is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Offer price must be a positive number',
    }),
  validity: z.date().optional(),
});

type PromotionFormData = z.infer<typeof promotionSchema>;

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
  
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      offerPrice: '',
      validity: undefined,
    },
  });

  const watchedOfferPrice = watch('offerPrice');
  const watchedValidity = watch('validity');

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
      reset({
        offerPrice: promotionDetail.offerPrice.toString(),
        validity: promotionDetail.validUntil ? new Date(promotionDetail.validUntil) : undefined,
      });
    }
  }, [promotionDetail, reset]);

  // Form submission handler
  const onSubmit = async (data: PromotionFormData) => {
    if (!promotionId) {
      setApiError("Promotion ID not available");
      return;
    }

    try {
      setApiError(null);
      
      await updatePromotion(
        promotionId, 
        parseFloat(data.offerPrice),
        data.validity ? data.validity.toISOString() : undefined
      );
      
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/user/promotions');
      }, 2000);

    } catch (err) {
      // Type guard for error with response
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
      ) {
        setApiError((err as { response: { data: { message: string } } }).response.data.message);
      } else {
        setApiError("Failed to update promotion");
      }
      console.error("Error updating promotion:", err);
    }
  };

  // Loading state for promotion details
  if (detailLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg p-6 h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state for promotion details
  if (detailError || !promotionDetail) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
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
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
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

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Promotion Updated!</h2>
            <p className="text-gray-600 mb-4">
              Your promotional deal has been updated successfully. You&apos;ll be redirected to the promotions page.
            </p>
            <div className="animate-pulse text-sm text-gray-500">Redirecting...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="bg-green-600 p-2.5 rounded-lg">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Edit Promotion
              </h1>
              <p className="text-gray-600 text-sm mt-0.5">
                Update promotional offer for &quot;{promotionDetail.product.productName}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Promotion Details</h2>
            <p className="text-gray-600 text-sm mt-0.5">Update the information below to modify your promotional deal</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            {/* Error Message */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="text-red-700 text-sm">{apiError}</span>
              </div>
            )}

            {/* Product Information (Read-only) */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 text-sm mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Product Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 text-xs block mb-1">Product Name:</span>
                  <div className="font-semibold text-gray-900">{promotionDetail.product.productName}</div>
                </div>
                {promotionDetail.product.chemicalName && (
                  <div>
                    <span className="text-gray-600 text-xs block mb-1">Chemical Name:</span>
                    <div className="font-semibold text-gray-900">{promotionDetail.product.chemicalName}</div>
                  </div>
                )}
                {promotionDetail.product.price && (
                  <div>
                    <span className="text-gray-600 text-xs block mb-1">Original Price:</span>
                    <div className="font-semibold text-gray-900">${promotionDetail.product.price.toFixed(2)}</div>
                  </div>
                )}
                <div>
                  <span className="text-gray-600 text-xs block mb-1">Status:</span>
                  <div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
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
              </div>
            </div>

            {/* Offer Price */}
            <div>
              <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-900 mb-1.5">
                Offer Price (USD) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  id="offerPrice"
                  {...register('offerPrice')}
                  step="0.01"
                  min="0"
                  placeholder="Enter promotional price"
                  className={cn(
                    "w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 transition-colors text-sm",
                    errors.offerPrice ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-green-500"
                  )}
                />
              </div>
              {errors.offerPrice && (
                <p className="text-xs text-red-600 mt-1.5">{errors.offerPrice.message}</p>
              )}
              {promotionDetail.product.price && watchedOfferPrice && (
                <div className="mt-1.5 text-xs">
                  {parseFloat(watchedOfferPrice) < promotionDetail.product.price ? (
                    <span className="text-green-600 font-medium">
                      Discount: ${(promotionDetail.product.price - parseFloat(watchedOfferPrice)).toFixed(2)} 
                      ({(((promotionDetail.product.price - parseFloat(watchedOfferPrice)) / promotionDetail.product.price) * 100).toFixed(1)}% off)
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-medium">
                      Price is higher than or equal to original price
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Validity Date with Shadcn Calendar */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Valid Until (Optional)
              </label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !watchedValidity && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watchedValidity ? format(watchedValidity, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watchedValidity}
                    onSelect={(date) => {
                      setValue('validity', date, { shouldValidate: true });
                      setCalendarOpen(false);
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-500 mt-1.5">
                Set an expiration date for this promotion. Leave empty for no expiration.
              </p>
              {promotionDetail.validUntil && (
                <p className="text-xs text-gray-600 mt-1">
                  Current expiry: {new Date(promotionDetail.validUntil).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSubmitting ? 'Updating...' : 'Update Promotion'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-medium text-blue-900 text-sm mb-2">Important Information</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Changes to your promotion will be submitted for admin review</li>
            <li>• The updated promotion will be visible to buyers once approved</li>
            <li>• You can only update the offer price and validity date</li>
            <li>• The offer price should be competitive to attract customers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditPromotion;
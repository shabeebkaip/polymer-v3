"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getProductList } from "@/apiServices/products";
import { createPromotion } from "@/apiServices/user";
import { useUserInfo } from "@/lib/useUserInfo";
import { Product } from "@/types/product";
import { SearchableDropdown } from '@/components/shared/SearchableDropdown';
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
  Calendar as CalendarIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Zod validation schema
const promotionSchema = z.object({
  productId: z.string().min(1, 'Please select a product'),
  offerPrice: z.string()
    .min(1, 'Offer price is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Offer price must be a positive number',
    }),
  validity: z.date().optional(),
});

type PromotionFormData = z.infer<typeof promotionSchema>;

const CreatePromotion = () => {
  const router = useRouter();
  const { user } = useUserInfo();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      productId: '',
      offerPrice: '',
      validity: undefined,
    },
  });

  const watchedProductId = watch('productId');
  const watchedOfferPrice = watch('offerPrice');
  const watchedValidity = watch('validity');

  // Fetch user's products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user?._id) return;
      
      try {
        setLoadingProducts(true);
        const response = await getProductList({
          createdBy: [user._id as string],
        });
        setProducts(response.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Failed to load your products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [user]);

  const selectedProduct = products.find(p => p._id === watchedProductId);

  // Transform products for SearchableDropdown
  const productOptions = products.map(product => ({
    _id: product._id || '',
    name: `${product.productName}${product.chemicalName ? ` (${product.chemicalName})` : ''} - $${product.price ? product.price.toFixed(2) : 'Price not set'}`,
  }));

  // Form submission handler
  const onSubmit = async (data: PromotionFormData) => {
    if (!user?._id) {
      toast.error("User information not available");
      return;
    }

    try {

      const promotionData: {
        productId: string;
        sellerId: string;
        offerPrice: number;
        validity?: string;
      } = {
        productId: data.productId,
        sellerId: user._id as string,
        offerPrice: parseFloat(data.offerPrice)
      };

      // Add validity if provided
      if (data.validity) {
        promotionData.validity = data.validity.toISOString();
      }

      const response = await createPromotion(promotionData);
      
      // Check if response contains info (deal already exists)
      if (response?.info) {
        toast.info(response.info);
        // Don't set success or redirect, just show the info message
        return;
      }
      
      toast.success('Promotion created successfully!');
      router.push('/user/promotions');

    } catch (err) {
      // Type guard for error with response
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
      ) {
        toast.error((err as { response: { data: { message: string } } }).response.data.message);
      } else {
        toast.error("Failed to create promotion");
      }
      console.error("Error creating promotion:", err);
    }
  };

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
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Create New Promotion
              </h1>
              <p className="text-gray-600 text-sm mt-0.5">
                Set up a special deal for one of your products
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Promotion Details</h2>
            <p className="text-gray-600 text-sm mt-0.5">Fill in the information below to create your promotional deal</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            {/* Product Selection with SearchableDropdown */}
            <div>
              <label htmlFor="productId" className="block text-sm font-medium text-gray-900 mb-1.5">
                Select Product *
              </label>
              {loadingProducts ? (
                <div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse"></div>
              ) : (
                <>
                  <SearchableDropdown
                    options={productOptions}
                    value={watchedProductId}
                    onValueChange={(value) => {
                      setValue('productId', value, { shouldValidate: true });
                    }}
                    placeholder="Search and select a product..."
                    searchPlaceholder="Search products..."
                    emptyText="No products found."
                    error={!!errors.productId}
                    disabled={products.length === 0}
                  />
                  {errors.productId && (
                    <p className="text-xs text-red-600 mt-1.5">{errors.productId.message}</p>
                  )}
                </>
              )}
              {products.length === 0 && !loadingProducts && (
                <p className="text-xs text-gray-500 mt-1.5">
                  No products found. You need to add products first before creating promotions.
                </p>
              )}
            </div>

            {/* Selected Product Info */}
            {selectedProduct && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 text-sm mb-3">Selected Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600 text-xs">Original Price:</span>
                    <div className="font-semibold text-gray-900">${selectedProduct.price ? selectedProduct.price.toFixed(2) : 'Not set'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">Stock:</span>
                    <div className="font-semibold text-gray-900">{selectedProduct.stock || 'N/A'} {selectedProduct.uom || ''}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">Chemical Name:</span>
                    <div className="font-semibold text-gray-900">{selectedProduct.chemicalName || 'N/A'}</div>
                  </div>
                </div>
              </div>
            )}

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
              {selectedProduct && watchedOfferPrice && selectedProduct.price && (
                <div className="mt-1.5 text-xs">
                  {parseFloat(watchedOfferPrice) < selectedProduct.price ? (
                    <span className="text-green-600 font-medium">
                      Discount: ${(selectedProduct.price - parseFloat(watchedOfferPrice)).toFixed(2)} 
                      ({(((selectedProduct.price - parseFloat(watchedOfferPrice)) / selectedProduct.price) * 100).toFixed(1)}% off)
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
                {isSubmitting ? 'Creating...' : 'Create Promotion'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-medium text-blue-900 text-sm mb-2">Important Information</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Your promotion will be submitted for admin review</li>
            <li>• Only approved promotions will be visible to buyers</li>
            <li>• You can only create promotions for your own products</li>
            <li>• The offer price should be competitive to attract customers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatePromotion;
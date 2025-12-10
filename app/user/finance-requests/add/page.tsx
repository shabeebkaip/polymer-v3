'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Calendar as CalendarIcon,
  MapPin,
  Package,
  FileText,
  DollarSign,
  Banknote,
  Calculator,
  Shield,
  TrendingUp,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { getProductList } from '@/apiServices/products';
import { createFinanceRequest } from '@/apiServices/user';
import { getCountryList } from '@/lib/useCountries';
import { FinanceFormData, Product } from '@/types/finance';

const CreateFinanceRequest = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [formData, setFormData] = useState<FinanceFormData>({
    productId: productId || '',
    emiMonths: 12,
    quantity: 1,
    estimatedPrice: 0,
    notes: '',
    productGrade: '',
    desiredDeliveryDate: undefined,
    destination: '',
    paymentTerms: '',
    requireLogisticsSupport: 'No',
    previousPurchaseHistory: '',
    additionalNotes: '',
    country: '',
  });

  const countries = useMemo(() => getCountryList(), []);

  // Debounced input values to prevent excessive re-renders
  const [inputValues, setInputValues] = useState({
    estimatedPrice: '',
    notes: '',
    productGrade: '',
    destination: '',
    previousPurchaseHistory: '',
    additionalNotes: '',
  });

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await getProductList({ page: 1, limit: 100 });
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    };

    // Await the promise to avoid ignoring it
    (async () => {
      await fetchProducts();
    })();
  }, []);

  // Update estimated price when product, quantity, or EMI months change
  useEffect(() => {
    if (selectedProduct?.pricePerUnit && formData.quantity) {
      const totalPrice = selectedProduct.pricePerUnit * formData.quantity;
      const priceString = totalPrice.toString();
      setFormData((prev) => ({ ...prev, estimatedPrice: totalPrice }));
      setInputValues((prev) => ({ ...prev, estimatedPrice: priceString }));
    }
  }, [selectedProduct, formData.quantity]);

  // Memoized handlers to prevent re-creation on every render
  const handleProductChange = useCallback(
    (productId: string) => {
      const product = products.find((p) => p._id === productId);
      setSelectedProduct(product || null);
      setFormData((prev) => ({
        ...prev,
        productId,
        productGrade: product?.grade?.name || '',
      }));
      setInputValues((prev) => ({
        ...prev,
        productGrade: product?.grade?.name || '',
      }));
    },
    [products]
  );

  const handleInputChange = useCallback(
    (field: keyof FinanceFormData, value: string | number | boolean | Date | undefined) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Optimized price input handler
  const handlePriceInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Update input value immediately for responsiveness
    setInputValues((prev) => ({ ...prev, estimatedPrice: value }));

    // Clean and validate the value
    const cleanValue = value.replace(/[^0-9.]/g, '');
    const parts = cleanValue.split('.');
    const formattedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleanValue;
    const numericValue = formattedValue === '' ? 0 : parseFloat(formattedValue) || 0;

    // Update form data
    setFormData((prev) => ({ ...prev, estimatedPrice: numericValue }));
  }, []);

  // Optimized text input handlers
  const handleTextInputChange = useCallback(
    (field: keyof typeof inputValues) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInputValues((prev) => ({ ...prev, [field]: value }));
        setFormData((prev) => ({ ...prev, [field]: value }));
      },
    []
  );

  const calculateMonthlyEMI = useMemo(() => {
    if (formData.estimatedPrice && formData.emiMonths) {
      return (formData.estimatedPrice / formData.emiMonths).toFixed(2);
    }
    return '0.00';
  }, [formData.estimatedPrice, formData.emiMonths]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productId) {
      toast.error('Please select a product');
      return;
    }

    if (!formData.notes.trim()) {
      toast.error('Please provide notes about your finance request');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        desiredDeliveryDate: formData.desiredDeliveryDate?.toISOString(),
      };

      await createFinanceRequest(submitData);
      toast.success('Finance request submitted successfully!');
      router.push('/user/finance-requests');
    } catch (error) {
      const errMsg =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data
          ? (error.response.data.message as string)
          : undefined;
      console.error('Error submitting finance request:', error);
      toast.error(errMsg || 'Failed to submit finance request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary-600 p-2.5 rounded-lg">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Create Finance Request
              </h1>
              <p className="text-gray-600 text-sm mt-0.5">
                Get flexible financing for your polymer purchases
              </p>
            </div>
          </div>

          {/* Finance Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <DollarSign className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">Flexible EMI</h3>
              </div>
              <p className="text-gray-600 text-xs">
                Choose EMI terms from 3 to 60 months that suit your cash flow.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">Competitive Rates</h3>
              </div>
              <p className="text-gray-600 text-xs">
                Industry-leading interest rates starting from 8.5% per annum.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary-100 p-2 rounded-lg">
                  <Shield className="w-4 h-4 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">Quick Approval</h3>
              </div>
              <p className="text-gray-600 text-xs">
                Pre-approved within 24 hours with minimal documentation.
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <h2 className="text-base font-semibold text-gray-900">Finance Request Details</h2>
            <p className="text-gray-600 text-sm mt-0.5">
              Fill in the details below to submit your finance request
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <Package className="w-4 h-4 inline mr-1.5 text-primary-600" />
                    Select Product *
                  </label>
                  <Select
                    value={formData.productId}
                    onValueChange={handleProductChange}
                    disabled={loadingProducts}
                  >
                    <SelectTrigger className="w-full h-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <SelectValue
                        placeholder={loadingProducts ? 'Loading products...' : 'Choose a product'}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">
                                {product.productName}
                              </span>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                {product.grade?.name && <span>Grade: {product.grade.name}</span>}
                                {product.grade?.name && product.createdBy?.company && (
                                  <span>•</span>
                                )}
                                {product.createdBy?.company && (
                                  <span>By: {product.createdBy.company}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity and EMI Months Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      <Package className="w-4 h-4 inline mr-1.5 text-primary-600" />
                      Quantity *
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                      className="h-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter quantity"
                    />
                    {selectedProduct?.uom && (
                      <p className="text-sm text-gray-500 mt-1">Unit: {selectedProduct.uom}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      <Calculator className="w-4 h-4 inline mr-1.5 text-primary-600" />
                      EMI Months *
                    </label>
                    <Select
                      value={formData.emiMonths.toString()}
                      onValueChange={(value) => handleInputChange('emiMonths', parseInt(value))}
                    >
                      <SelectTrigger className="h-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[3, 6, 9, 12, 18, 24, 36, 48, 60].map((months) => (
                          <SelectItem key={months} value={months.toString()}>
                            {months} months
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Estimated Price and Monthly EMI */}
                <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        <Banknote className="w-4 h-4 inline mr-1.5 text-primary-600" />
                        Estimated Price ($)
                      </label>
                      <Input
                        type="text"
                        value={
                          inputValues.estimatedPrice ||
                          (formData.estimatedPrice === 0 ? '' : formData.estimatedPrice.toString())
                        }
                        onChange={handlePriceInputChange}
                        onBlur={() => {
                          // Format to 2 decimal places on blur if there's a value
                          if (formData.estimatedPrice > 0) {
                            const formatted = parseFloat(
                              formData.estimatedPrice.toString()
                            ).toFixed(2);
                            const formattedValue = parseFloat(formatted);
                            setFormData((prev) => ({
                              ...prev,
                              estimatedPrice: formattedValue,
                            }));
                            setInputValues((prev) => ({
                              ...prev,
                              estimatedPrice: formattedValue.toString(),
                            }));
                          }
                        }}
                        className="h-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                        placeholder="Enter price"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Monthly EMI ($)
                      </label>
                      <div className="h-10 px-3 bg-white border border-gray-300 rounded-lg text-base font-semibold text-primary-600 flex items-center">
                        ${calculateMonthlyEMI}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Product Grade
                  </label>
                  <Input
                    value={formData.productGrade}
                    onChange={(e) =>
                      handleInputChange('productGrade', e.target.value)
                    }
                    className="h-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., A+, Standard"
                  />
                </div>

                {/* Request Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <FileText className="w-4 h-4 inline mr-1.5 text-primary-600" />
                    Request Notes *
                  </label>
                  <Textarea
                    value={inputValues.notes}
                    onChange={handleTextInputChange('notes')}
                    className="min-h-[100px] border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe your finance requirements, business use case, and any specific terms you need..."
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Delivery Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <CalendarIcon className="w-4 h-4 inline mr-1.5 text-primary-600" />
                    Expected Delivery Date *
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-10 justify-start text-left font-normal border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        {formData.desiredDeliveryDate ? (
                          formData.desiredDeliveryDate.toLocaleDateString()
                        ) : (
                          <span className="text-gray-500">Select delivery date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.desiredDeliveryDate}
                        onSelect={(date) => handleInputChange('desiredDeliveryDate', date)}
                        disabled={(date) =>
                          date < new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1.5 text-primary-600" />
                    Destination
                  </label>
                  <Input
                    value={inputValues.destination}
                    onChange={handleTextInputChange('destination')}
                    className="h-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter delivery destination"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Country</label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleInputChange('country', value)}
                  >
                    <SelectTrigger className="h-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Terms */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Payment Terms
                  </label>
                  <Select
                    value={formData.paymentTerms}
                    onValueChange={(value) => handleInputChange('paymentTerms', value)}
                  >
                    <SelectTrigger className="h-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="advance">Advance Payment</SelectItem>
                      <SelectItem value="net30">Net 30 Days</SelectItem>
                      <SelectItem value="net60">Net 60 Days</SelectItem>
                      <SelectItem value="net90">Net 90 Days</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                      <SelectItem value="lc">Letter of Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Logistics Support */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    <Truck className="w-4 h-4 inline mr-1.5 text-primary-600" />
                    Require Logistics Support?
                  </label>
                  <Select
                    value={formData.requireLogisticsSupport}
                    onValueChange={(value) => handleInputChange('requireLogisticsSupport', value)}
                  >
                    <SelectTrigger className="h-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Previous Purchase History */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Previous Purchase History
                  </label>
                  <Textarea
                    value={inputValues.previousPurchaseHistory}
                    onChange={handleTextInputChange('previousPurchaseHistory')}
                    className="min-h-[80px] border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe your previous purchasing experience with similar products..."
                    rows={3}
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Additional Notes
                  </label>
                  <Textarea
                    value={inputValues.additionalNotes}
                    onChange={handleTextInputChange('additionalNotes')}
                    className="min-h-[80px] border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Any additional information or special requirements..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  <AlertCircle className="w-4 h-4 inline mr-1.5 text-amber-500" />
                  All requests are subject to credit approval.
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.productId || !inputValues.notes.trim()}
                  className="px-6 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-sm hover:shadow transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function FinanceRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading...
        </div>
      }
    >
      <CreateFinanceRequest />
    </Suspense>
  );
}

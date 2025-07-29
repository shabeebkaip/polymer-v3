'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-emerald-50/30">
      <div className="container mx-auto px-6 py-8 ">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-emerald-600/5 to-teal-600/5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>

          <div className="relative z-10">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Finance Requests
            </Button>

            <div className="flex items-center gap-5 mb-8">
              <div className="relative">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                  Finance Request
                </h1>
                <p className="text-gray-600 text-lg mt-2 font-medium">
                  Get flexible financing for your polymer purchases
                </p>
              </div>
            </div>

            {/* Finance Benefits Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Flexible EMI</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Choose EMI terms from 3 to 60 months that suit your cash flow requirements.
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-100 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Competitive Rates</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Get industry-leading interest rates starting from 8.5% per annum.
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-teal-100 p-3 rounded-xl">
                    <Shield className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Quick Approval</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Get pre-approved within 24 hours with minimal documentation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          <div className="border-b border-gray-200/60 px-8 py-6 bg-gradient-to-r from-gray-50/80 to-green-50/30">
            <h2 className="text-xl font-bold text-gray-900">Finance Request Details</h2>
            <p className="text-gray-600 mt-1">
              Fill in the details below to submit your finance request
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <Package className="w-4 h-4 inline mr-2 text-green-600" />
                    Select Product *
                  </label>
                  <Select
                    value={formData.productId}
                    onValueChange={handleProductChange}
                    disabled={loadingProducts}
                  >
                    <SelectTrigger className="w-full py-3 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      <Package className="w-4 h-4 inline mr-2 text-green-600" />
                      Quantity *
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                      className="py-3 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter quantity"
                    />
                    {selectedProduct?.uom && (
                      <p className="text-sm text-gray-500 mt-1">Unit: {selectedProduct.uom}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      <Calculator className="w-4 h-4 inline mr-2 text-green-600" />
                      EMI Months *
                    </label>
                    <Select
                      value={formData.emiMonths.toString()}
                      onValueChange={(value) => handleInputChange('emiMonths', parseInt(value))}
                    >
                      <SelectTrigger className="py-3 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500">
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
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        <Banknote className="w-4 h-4 inline mr-2 text-green-600" />
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
                        className="py-3 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/70"
                        placeholder="Enter price"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Monthly EMI ($)
                      </label>
                      <div className="py-3 px-4 bg-white/70 border border-gray-300 rounded-xl text-lg font-bold text-green-600">
                        ${calculateMonthlyEMI}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Grade */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Product Grade
                  </label>
                  <Input
                    value={inputValues.productGrade}
                    onChange={handleTextInputChange('productGrade')}
                    className="py-3 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter product grade"
                  />
                </div>

                {/* Request Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <FileText className="w-4 h-4 inline mr-2 text-green-600" />
                    Request Notes *
                  </label>
                  <Textarea
                    value={inputValues.notes}
                    onChange={handleTextInputChange('notes')}
                    className="py-3 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[120px]"
                    placeholder="Describe your finance requirements, business use case, and any specific terms you need..."
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Delivery Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <CalendarIcon className="w-4 h-4 inline mr-2 text-green-600" />
                    Desired Delivery Date
                  </label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full py-3 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-green-600" />
                        {formData.desiredDeliveryDate ? (
                          <span className="text-gray-500">
                            {new Date(formData.desiredDeliveryDate).toLocaleDateString('en-US', {
                              weekday: 'long', // e.g., "Thursday"
                              year: 'numeric', // e.g., "2025"
                              month: 'long', // e.g., "July"
                              day: 'numeric', // e.g., "17"
                            })}
                          </span>
                        ) : (
                          <span className="text-gray-500">Select delivery date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.desiredDeliveryDate}
                        onSelect={(date) => {
                          handleInputChange('desiredDeliveryDate', date);
                          setIsCalendarOpen(false);
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <MapPin className="w-4 h-4 inline mr-2 text-green-600" />
                    Destination
                  </label>
                  <Input
                    value={inputValues.destination}
                    onChange={handleTextInputChange('destination')}
                    className="py-3 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter delivery destination"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Country</label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleInputChange('country', value)}
                  >
                    <SelectTrigger className="py-3 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500">
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
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Payment Terms
                  </label>
                  <Select
                    value={formData.paymentTerms}
                    onValueChange={(value) => handleInputChange('paymentTerms', value)}
                  >
                    <SelectTrigger className="py-3 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500">
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
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <Truck className="w-4 h-4 inline mr-2 text-green-600" />
                    Require Logistics Support?
                  </label>
                  <Select
                    value={formData.requireLogisticsSupport}
                    onValueChange={(value) => handleInputChange('requireLogisticsSupport', value)}
                  >
                    <SelectTrigger className="py-3 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500">
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
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Previous Purchase History
                  </label>
                  <Textarea
                    value={inputValues.previousPurchaseHistory}
                    onChange={handleTextInputChange('previousPurchaseHistory')}
                    className="py-3 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Describe your previous purchasing experience with similar products..."
                    rows={3}
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Additional Notes
                  </label>
                  <Textarea
                    value={inputValues.additionalNotes}
                    onChange={handleTextInputChange('additionalNotes')}
                    className="py-3 px-4 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Any additional information or special requirements..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4 inline mr-2 text-amber-500" />
                  All finance requests are subject to credit approval and terms may vary.
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.productId || !inputValues.notes.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Finance Request
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

export default CreateFinanceRequest;

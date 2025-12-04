'use client';
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { getGrades, getIncoterms, getPackagingTypes } from '@/apiServices/shared';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Package, Truck, Clock } from 'lucide-react';
import { createQuoteRequest } from '@/apiServices/user';
import { useRouter } from 'next/navigation';
import { ProductQuoteRequest } from '@/types/quote';
import Cookies from 'js-cookie';
import { Grade, Incoterm, PackagingType, QuoteRequestModalProps, Country } from '@/types/shared';
import { getCountryList } from '@/lib/useCountries';
import { SearchableDropdown } from './SearchableDropdown';

const QuoteRequestModal = ({
  className,
  productId,
  uom,
  buttonText = 'Request Quote',
  children,
}: QuoteRequestModalProps) => {
  const token = Cookies.get('token');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoized initial data
  const initialData = useMemo(
    () => ({
      productId,
      desiredQuantity: 0,
      uom,
      gradeId: '',
      incotermId: '',
      shippingCountry: '',
      shippingAddress: '',
      packagingTypeId: '',
      deliveryDeadline: undefined,
      application: '',
      additionalRequirements: '',
    }),
    [productId, uom]
  );

  const dataRef = useRef<Partial<ProductQuoteRequest>>(initialData);
  const [data, setData] = useState(initialData);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [incoterms, setIncoterms] = useState<Incoterm[]>([]);
  const [packagingTypes, setPackagingTypes] = useState<PackagingType[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Simple validation - only check required fields on submit
  const validateForm = useCallback(() => {
    const currentData = dataRef.current;
    if (!currentData.productId || !currentData.desiredQuantity || currentData.desiredQuantity <= 0) {
      toast.error('Please enter a valid quantity');
      return false;
    }
    return true;
  }, []);

  // Load all dropdown options
  const loadDropdowns = useCallback(async () => {
    if (dropdownsLoaded) return;

    try {
      setLoading(true);
      const [gradesRes, incotermsRes, packagingRes] = await Promise.all([
        getGrades(),
        getIncoterms(),
        getPackagingTypes(),
      ]);

      setGrades(gradesRes.data);
      setIncoterms(incotermsRes.data);
      setPackagingTypes(packagingRes.data);
      setCountries(getCountryList().sort((a, b) => a.name.localeCompare(b.name)));
      setDropdownsLoaded(true);
    } catch (err) {
      console.error('Error fetching dropdowns', err);
      toast.error('Failed to load form options');
    } finally {
      setLoading(false);
    }
  }, [dropdownsLoaded]);

  const handletrigger = useCallback(() => {
    if (token) {
      setOpen(true);
      loadDropdowns();
    } else {
      toast.error('Please login to request a quote.');
      router.push('/auth/login');
    }
  }, [token, loadDropdowns, router]);

  // Field change handler
  const onFieldChange = useCallback((field: string, value: string | number | Date | undefined) => {
    const processedValue = field === 'desiredQuantity' && typeof value === 'string' 
      ? parseFloat(value) || 0 
      : value;

    dataRef.current = { ...dataRef.current, [field]: processedValue };
    setData((prev) => ({ ...prev, [field]: processedValue }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Creating Quote Request...');

    try {
      // Build clean payload with only non-empty values
      const payload: Partial<ProductQuoteRequest> = {
        productId: dataRef.current.productId!,
        desiredQuantity: dataRef.current.desiredQuantity || 0,
      };

      // Add optional fields if they have values
      const optionalFields: (keyof ProductQuoteRequest)[] = [
        'uom', 'shippingCountry', 'shippingAddress', 'shippingCity', 
        'shippingState', 'shippingPincode', 'deliveryDeadline', 'paymentTerms',
        'gradeId', 'incotermId', 'packagingTypeId', 'application', 'additionalRequirements'
      ];

      optionalFields.forEach(field => {
        const value = dataRef.current[field];
        if (value && (typeof value !== 'string' || value.trim())) {
          payload[field] = value as any;
        }
      });

      await createQuoteRequest(payload as ProductQuoteRequest);
      toast.dismiss(toastId);
      toast.success('Quote request created successfully!');
      
      // Reset form
      dataRef.current = initialData;
      setData(initialData);
      setOpen(false);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Failed to create quote request. Please try again.');
      console.error('Quote request error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, initialData]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      dataRef.current = initialData;
      setData(initialData);
    }
  }, [open, initialData]);

  return (
    <>
      <button
        className={`${className} cursor-pointer transition-all duration-200  active:scale-95`}
        onClick={handletrigger}
        disabled={loading}
      >
        {children || buttonText}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl">
          <DialogHeader className="border-b border-gray-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Request Quote
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mt-1">
                  Fill out the form below and our team will reach out to you promptly
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[60vh] pr-2 -mr-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                  <p className="text-gray-600">Loading form options...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 py-2">
                {/* Product & Quantity Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <Package className="w-5 h-5 text-primary-500" />
                    Product Details
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Quantity *</label>
                      <div className="relative">
                        <Input
                          placeholder="Enter quantity"
                          className="pr-20 bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
                          type="number"
                          min="1"
                          onChange={(e) => onFieldChange('desiredQuantity', e.target.value)}
                          value={data?.desiredQuantity || ''}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-primary-500 border-l border-gray-200 pl-3">
                          {data?.uom}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Grade</label>
                      <SearchableDropdown
                        options={grades}
                        value={data.gradeId || ''}
                        onValueChange={(value) => onFieldChange('gradeId', value)}
                        placeholder="Select product grade"
                        searchPlaceholder="Search grade..."
                        emptyText="No grade found"
                        className="bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping & Logistics Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <Truck className="w-5 h-5 text-primary-500" />
                    Shipping & Logistics
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Incoterm</label>
                      <SearchableDropdown
                        options={incoterms}
                        value={data.incotermId || ''}
                        onValueChange={(value) => onFieldChange('incotermId', value)}
                        placeholder="Select shipping terms"
                        searchPlaceholder="Search incoterm..."
                        emptyText="No incoterm found"
                        className="bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Country</label>
                      <SearchableDropdown
                        options={countries.map(c => ({ _id: c.name, name: c.name }))} 
                        value={data.shippingCountry || ''}
                        onValueChange={(value) => onFieldChange('shippingCountry', value)}
                        placeholder="Select destination country"
                        searchPlaceholder="Search country..."
                        emptyText="No country found"
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Full Destination Address
                    </label>
                    <Textarea
                      placeholder="Enter complete shipping address including city, postal code, and any specific delivery instructions"
                      className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 min-h-[80px]"
                      onChange={(e) => onFieldChange('shippingAddress', e.target.value)}
                      value={data?.shippingAddress || ''}
                    />
                  </div>
                </div>

                {/* Packaging Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <Package className="w-5 h-5 text-primary-500" />
                    Packaging Requirements
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Packaging Type</label>
                      <SearchableDropdown
                        options={packagingTypes}
                        value={data.packagingTypeId || ''}
                        onValueChange={(value) => onFieldChange('packagingTypeId', value)}
                        placeholder="Select packaging type"
                        searchPlaceholder="Search packaging type..."
                        emptyText="No packaging type found"
                        className="bg-white"
                      />
                    </div>

                  </div>
                </div>

                {/* Delivery Date Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <Clock className="w-5 h-5 text-primary-500" />
                    Delivery Timeline
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Delivery Date</label>
                    <div className="relative">
                      <Input
                        readOnly
                        value={
                          data?.deliveryDeadline
                            ? new Date(data?.deliveryDeadline).toLocaleDateString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : ''
                        }
                        placeholder="Select delivery date"
                        onFocus={() => setCalendarOpen(true)}
                        className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 cursor-pointer pr-10"
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {calendarOpen && (
                        <div className="absolute z-50 top-full mt-2 bg-white shadow-xl rounded-xl border border-gray-200 p-4">
                          <Calendar
                            mode="single"
                            selected={data?.deliveryDeadline}
                            onSelect={(date) => {
                              onFieldChange('deliveryDeadline', date);
                              setCalendarOpen(false);
                            }}
                            disabled={(date) => date < new Date()}
                            className="rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-gray-800">Additional Information</div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Application/Use Case
                      </label>
                      <Textarea
                        placeholder="What will this product be used for? (e.g., automotive parts, packaging, construction)"
                        className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 min-h-[80px]"
                        onChange={(e) => onFieldChange('application', e.target.value)}
                        value={data?.application || ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Additional Requirements</label>
                      <Textarea
                        placeholder="Any special requirements, certifications needed, or additional information for the supplier"
                        className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 min-h-[100px]"
                        onChange={(e) => onFieldChange('additionalRequirements', e.target.value)}
                        value={data?.additionalRequirements || ''}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-gray-100 pt-6 flex flex-row justify-between gap-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 px-6"
                disabled={loading}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || isSubmitting}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                'Send Quote Request'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuoteRequestModal;

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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { getGrades, getIncoterms, getPackagingTypes } from '@/apiServices/shared';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, MapPin, Package, Truck, Clock } from 'lucide-react';
import { createQuoteRequest } from '@/apiServices/user';
import { useRouter } from 'next/navigation';
import { ProductQuoteRequest } from '@/types/quote';
import Cookies from 'js-cookie';

interface Grade {
  _id: string;
  name: string;
}
interface Incoterm {
  _id: string;
  name: string;
}
interface PackagingType {
  _id: string;
  name: string;
}
interface QuoteRequestModalProps {
  className?: string;
  productId: string;
  uom: string;
  buttonText?: string;
  children?: React.ReactNode;
}

// Memoized input components to prevent unnecessary re-renders
const MemoizedInput = React.memo(
  ({
    placeholder,
    className,
    type = 'text',
    onChange,
    value,
    min,
    ...props
  }: {
    placeholder: string;
    className?: string;
    type?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string | number;
    min?: number | string;
    [key: string]: unknown;
  }) => (
    <Input
      placeholder={placeholder}
      className={className}
      type={type}
      onChange={onChange}
      value={value}
      min={min}
      {...props}
    />
  )
);

const MemoizedTextarea = React.memo(
  ({
    placeholder,
    className,
    onChange,
    value,
    ...props
  }: {
    placeholder: string;
    className?: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    value: string;
    [key: string]: unknown;
  }) => (
    <Textarea
      placeholder={placeholder}
      className={className}
      onChange={onChange}
      value={value}
      {...props}
    />
  )
);

const MemoizedSelect = React.memo(
  ({
    value,
    onValueChange,
    placeholder,
    className,
    children,
  }: {
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  )
);

MemoizedInput.displayName = 'MemoizedInput';
MemoizedTextarea.displayName = 'MemoizedTextarea';
MemoizedSelect.displayName = 'MemoizedSelect';

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

  // Use refs for immediate updates without triggering re-renders
  const dataRef = useRef<Partial<ProductQuoteRequest>>({
    requestType: 'product_quote',
    product: productId,
    quantity: 0,
    uom: uom,
    grade: '',
    incoterm: '',
    country: '',
    destination: '',
    packagingType: '',
    packaging_size: '',
    expected_annual_volume: undefined,
    delivery_date: undefined,
    application: '',
    message: '',
    request_document: '',
    open_request: false,
  });

  // Memoized initial data to prevent recreating on every render
  const initialData = useMemo(
    () => ({
      requestType: 'product_quote' as const,
      product: productId,
      quantity: 0,
      uom: uom,
      grade: '',
      incoterm: '',
      country: '',
      destination: '',
      packagingType: '',
      packaging_size: '',
      expected_annual_volume: undefined,
      delivery_date: undefined,
      application: '',
      message: '',
      request_document: '',
      open_request: false,
    }),
    [productId, uom]
  );

  const [data, setData] = useState(initialData);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [incoterms, setIncoterms] = useState<Incoterm[]>([]);
  const [packagingTypes, setPackagingTypes] = useState<PackagingType[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Debounced validation - only check on submit or when form is complete
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized validation function
  const validateForm = useCallback(() => {
    const currentData = dataRef.current;
    const errors: string[] = [];

    if (!currentData.quantity || currentData.quantity <= 0)
      errors.push('Please enter a valid quantity');
    if (!currentData.grade) errors.push('Please select the grade');
    if (!currentData.incoterm) errors.push('Please select the incoterm');
    if (!currentData.country) errors.push('Please enter the country');
    if (!currentData.destination) errors.push('Please enter the destination');
    if (!currentData.packaging_size) errors.push('Please enter the packaging size');
    if (!currentData.delivery_date) errors.push('Please select the delivery date');

    setValidationErrors(errors);
    return errors.length === 0;
  }, []);

  // Debounced validation trigger
  const triggerValidation = useCallback(() => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    validationTimeoutRef.current = setTimeout(() => {
      validateForm();
    }, 500); // Only validate after 500ms of inactivity
  }, [validateForm]);

  const isFormValid = validationErrors.length === 0;

  // Memoized dropdown loading function
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

  // Optimized field change handler with immediate UI updates
  const onFieldChange = useCallback(
    (field: string, value: string | number | Date | undefined) => {
      let processedValue: string | number | Date | undefined = value;

      // Handle numeric fields
      if (field === 'quantity' || field === 'expected_annual_volume') {
        processedValue = value && typeof value === 'string' ? parseFloat(value) || 0 : value;
      }

      // Update ref immediately for internal tracking
      dataRef.current = {
        ...dataRef.current,
        [field]: processedValue,
      };

      // Update state for UI reactivity (batched by React)
      setData((prev) => ({
        ...prev,
        [field]: processedValue,
      }));

      // Only trigger validation for critical fields or after delay
      if (
        [
          'quantity',
          'grade',
          'incoterm',
          'country',
          'destination',
          'packaging_size',
          'delivery_date',
        ].includes(field)
      ) {
        triggerValidation();
      }
    },
    [triggerValidation]
  );

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    // Force immediate validation on submit
    const isValid = validateForm();

    if (!isValid) {
      validationErrors.forEach((err) => toast.error(err));
      setIsSubmitting(false);
      return;
    }

    const toastId = toast.loading('Creating Quote Request...');

    try {
      // Prepare data according to unified schema for product_quote
      const submitData: ProductQuoteRequest = {
        requestType: 'product_quote',
        product: dataRef.current.product!,
        quantity: dataRef.current.quantity || 0,
        uom: dataRef.current.uom!,
        country: dataRef.current.country!,
        destination: dataRef.current.destination!,
        packaging_size: dataRef.current.packaging_size!,
        delivery_date: dataRef.current.delivery_date!,
        // Only include ObjectId fields if they have valid values
        ...(dataRef.current.grade &&
          dataRef.current.grade.trim() && { grade: dataRef.current.grade }),
        ...(dataRef.current.incoterm &&
          dataRef.current.incoterm.trim() && { incoterm: dataRef.current.incoterm }),
        ...(dataRef.current.packagingType &&
          dataRef.current.packagingType.trim() && { packagingType: dataRef.current.packagingType }),
        // Include other optional fields only if they have values
        ...(dataRef.current.expected_annual_volume && {
          expected_annual_volume: dataRef.current.expected_annual_volume,
        }),
        ...(dataRef.current.application &&
          dataRef.current.application.trim() && { application: dataRef.current.application }),
        ...(dataRef.current.message &&
          dataRef.current.message.trim() && { message: dataRef.current.message }),
        ...(dataRef.current.request_document &&
          dataRef.current.request_document.trim() && {
            request_document: dataRef.current.request_document,
          }),
        open_request: dataRef.current.open_request || false,
        sourceSection: 'product_detail',
      };

      await createQuoteRequest(submitData);
      toast.dismiss(toastId);
      toast.success('Quote request created successfully!');
      setOpen(false);

      // Reset form on success
      const resetData = { ...initialData };
      dataRef.current = resetData;
      setData(resetData);
      setValidationErrors([]);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Failed to create quote request. Please try again.');
      console.error('Quote request error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, validationErrors, initialData]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, []);

  // Sync dataRef with initial data when modal opens
  useEffect(() => {
    if (open) {
      dataRef.current = { ...data };
    }
  }, [open, data]);

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
                        <MemoizedInput
                          placeholder="Enter quantity"
                          className="pr-20 bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
                          type="number"
                          min="1"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onFieldChange('quantity', e.target.value)
                          }
                          value={data?.quantity || ''}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-primary-500 border-l border-gray-200 pl-3">
                          {data?.uom}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Grade *</label>
                      <MemoizedSelect
                        value={data.grade}
                        onValueChange={(value: string) => onFieldChange('grade', value)}
                        placeholder="Select product grade"
                        className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
                      >
                        {grades.map((grade) => (
                          <SelectItem key={grade._id} value={grade._id}>
                            {grade.name}
                          </SelectItem>
                        ))}
                      </MemoizedSelect>
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
                      <label className="text-sm font-medium text-gray-700">Incoterm *</label>
                      <MemoizedSelect
                        value={data.incoterm}
                        onValueChange={(value: string) => onFieldChange('incoterm', value)}
                        placeholder="Select shipping terms"
                        className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
                      >
                        {incoterms.map((incoterm) => (
                          <SelectItem key={incoterm._id} value={incoterm._id}>
                            {incoterm.name}
                          </SelectItem>
                        ))}
                      </MemoizedSelect>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Country *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <MemoizedInput
                          placeholder="Enter destination country"
                          className="pl-10 bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
                          type="text"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onFieldChange('country', e.target.value)
                          }
                          value={data?.country}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Full Destination Address *
                    </label>
                    <MemoizedTextarea
                      placeholder="Enter complete shipping address including city, postal code, and any specific delivery instructions"
                      className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 min-h-[80px]"
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        onFieldChange('destination', e.target.value)
                      }
                      value={data?.destination}
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
                      <MemoizedSelect
                        value={data.packagingType}
                        onValueChange={(value: string) => onFieldChange('packagingType', value)}
                        placeholder="Select packaging type"
                        className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
                      >
                        {packagingTypes.map((packagingType) => (
                          <SelectItem key={packagingType._id} value={packagingType._id}>
                            {packagingType.name}
                          </SelectItem>
                        ))}
                      </MemoizedSelect>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Packaging Size *</label>
                      <MemoizedInput
                        placeholder="e.g., 25kg bags, 1000kg big bags"
                        className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onFieldChange('packaging_size', e.target.value)
                        }
                        value={data?.packaging_size}
                      />
                    </div>
                  </div>
                </div>

                {/* Timeline & Volume Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <Clock className="w-5 h-5 text-primary-500" />
                    Timeline & Volume
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Expected Annual Volume
                      </label>
                      <MemoizedInput
                        placeholder="Annual quantity requirement"
                        className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
                        type="number"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onFieldChange('expected_annual_volume', e.target.value)
                        }
                        value={data?.expected_annual_volume || ''}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Delivery Date *</label>
                      <div className="relative">
                        <MemoizedInput
                          readOnly
                          value={
                            data?.delivery_date
                              ? new Date(data?.delivery_date).toLocaleDateString('en-US', {
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
                              selected={data?.delivery_date}
                              onSelect={(date) => {
                                onFieldChange('delivery_date', date);
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
                </div>

                {/* Additional Information Section */}
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-gray-800">Additional Information</div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Application/Use Case
                      </label>
                      <MemoizedTextarea
                        placeholder="What will this product be used for? (e.g., automotive parts, packaging, construction)"
                        className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 min-h-[80px]"
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          onFieldChange('application', e.target.value)
                        }
                        value={data?.application}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Additional Notes</label>
                      <MemoizedTextarea
                        placeholder="Any special requirements, certifications needed, or additional information for the supplier"
                        className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 min-h-[100px]"
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          onFieldChange('message', e.target.value)
                        }
                        value={data?.message}
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
              disabled={!isFormValid || loading || isSubmitting}
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

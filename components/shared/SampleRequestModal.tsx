'use client';
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { getGrades } from '@/apiServices/shared';
import { createSampleRequest } from '@/apiServices/user';
import { Calendar as CalendarIcon, Package, MapPin, Clock, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

// Memoized input components to prevent unnecessary re-renders
const MemoizedInput = React.memo(
  ({
    placeholder,
    className,
    type = 'text',
    onChange,
    value,
    min,
    readOnly,
    onFocus,
    ...props
  }: {
    placeholder: string;
    className?: string;
    type?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string | number;
    min?: number | string;
    readOnly?: boolean;
    onFocus?: () => void;
    [key: string]: unknown;
  }) => (
    <Input
      placeholder={placeholder}
      className={className}
      type={type}
      onChange={onChange}
      value={value}
      min={min}
      readOnly={readOnly}
      onFocus={onFocus}
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

import { Grade, SampleRequestModalProps } from '@/types/shared';

const SampleRequestModal = ({
  className,
  productId,
  uom,
  buttonText = 'Request for Sample',
  children,
}: SampleRequestModalProps) => {
  const token = Cookies.get('token');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use refs for immediate updates without triggering re-renders
  const dataRef = useRef({
    product: productId,
    quantity: '',
    uom: uom,
    streetName: '',
    address: '',
    postCode: '',
    country: '',
    grade: '',
    application: '',
    expected_annual_volume: '',
    orderDate: undefined as Date | undefined,
    neededBy: undefined as Date | undefined,
    samplePrice: '',
    forFree: false,
    message: '',
    request_document: '',
  });

  // Memoized initial data to prevent recreating on every render
  const initialData = useMemo(
    () => ({
      product: productId,
      quantity: '',
      uom: uom,
      streetName: '',
      address: '',
      postCode: '',
      country: '',
      grade: '',
      application: '',
      expected_annual_volume: '',
      orderDate: undefined as Date | undefined,
      neededBy: undefined as Date | undefined,
      samplePrice: '',
      forFree: false,
      message: '',
      request_document: '',
    }),
    [productId, uom]
  );

  const [data, setData] = useState(initialData);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarOpen2, setCalendarOpen2] = useState(false);

  // Debounced validation - only check on submit or when form is complete
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized validation function
  const validateForm = useCallback(() => {
    const currentData = dataRef.current;
    const errors: string[] = [];

    if (!currentData.quantity) errors.push('Please enter the quantity');
    if (!currentData.address) errors.push('Please enter the address');
    if (!currentData.country) errors.push('Please enter the country');

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
      const gradesRes = await getGrades();
      setGrades(gradesRes.data);
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
      toast.error('Please login to request a sample.');
      router.push('/auth/login');
    }
  }, [token, loadDropdowns, router]);

  // Optimized field change handler with immediate UI updates
  const onFieldChange = useCallback(
    (field: string, value: string | Date | undefined) => {
      const processedValue = value instanceof Date ? value : value || '';

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
      if (['quantity', 'address', 'country'].includes(field)) {
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

    const toastId = toast.loading('Creating Sample Request...');

    try {
      // Use the current data from ref for submission
      await createSampleRequest(dataRef.current);
      toast.dismiss(toastId);
      toast.success('Sample request created successfully!');
      setOpen(false);

      // Reset form on success
      const resetData = { ...initialData };
      dataRef.current = resetData;
      setData(resetData);
      setValidationErrors([]);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Failed to create sample request. Please try again.');
      console.error('Sample request error:', error);
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
        className={`${className} transition-all duration-200 cursor-pointer active:scale-95`}
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
                  Request Sample
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mt-1">
                  Request a product sample and our team will process your request promptly
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
                {/* Product & Sample Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <Package className="w-5 h-5 text-primary-500" />
                    Sample Details
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Quantity *</label>
                      <div className="relative">
                        <MemoizedInput
                          placeholder="Enter sample quantity"
                          className="pr-20 bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
                          type="number"
                          min="1"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onFieldChange('quantity', e.target.value)
                          }
                          value={data?.quantity}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-primary-500 border-l border-gray-200 pl-3">
                          {data?.uom}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Grade</label>
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
                        value={data?.expected_annual_volume}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Application/Use Case
                      </label>
                      <MemoizedTextarea
                        placeholder="What will this product be used for?"
                        className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 min-h-[80px]"
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          onFieldChange('application', e.target.value)
                        }
                        value={data?.application}
                      />
                    </div>
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <Clock className="w-5 h-5 text-primary-500" />
                    Timeline
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Needed By</label>
                      <div className="relative">
                        <MemoizedInput
                          readOnly
                          value={
                            data?.neededBy
                              ? new Date(data?.neededBy).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : ''
                          }
                          placeholder="When do you need this sample?"
                          onFocus={() => setCalendarOpen2(true)}
                          className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 cursor-pointer pr-10"
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        {calendarOpen2 && (
                          <div className="absolute z-50 top-full mt-2 bg-white shadow-xl rounded-xl border border-gray-200 p-4">
                            <Calendar
                              mode="single"
                              selected={data?.neededBy ? new Date(data.neededBy) : undefined}
                              onSelect={(date) => {
                                onFieldChange('neededBy', date);
                                setCalendarOpen2(false);
                              }}
                              disabled={(date) => date < new Date()}
                              className="rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Expected Purchase Date
                      </label>
                      <div className="relative">
                        <MemoizedInput
                          readOnly
                          value={
                            data?.orderDate
                              ? new Date(data?.orderDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : ''
                          }
                          placeholder="When might you place an order?"
                          onFocus={() => setCalendarOpen(true)}
                          className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 cursor-pointer pr-10"
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        {calendarOpen && (
                          <div className="absolute z-50 top-full mt-2 bg-white shadow-xl rounded-xl border border-gray-200 p-4">
                            <Calendar
                              mode="single"
                              selected={data?.orderDate ? new Date(data.orderDate) : undefined}
                              onSelect={(date) => {
                                onFieldChange('orderDate', date);
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

                {/* Shipping Address Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <MapPin className="w-5 h-5 text-primary-500" />
                    Shipping Address
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Country *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <MemoizedInput
                          placeholder="Enter country"
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
                    <label className="text-sm font-medium text-gray-700">Complete Address *</label>
                    <MemoizedTextarea
                      placeholder="Enter complete shipping address including street, postal code, and any specific delivery instructions"
                      className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 min-h-[80px]"
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        onFieldChange('address', e.target.value)
                      }
                      value={data?.address}
                    />
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <FileText className="w-5 h-5 text-primary-500" />
                    Additional Information
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Additional Notes</label>
                    <MemoizedTextarea
                      placeholder="Any special requirements, handling instructions, or additional information for the supplier"
                      className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 min-h-[100px]"
                      rows={3}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        onFieldChange('message', e.target.value)
                      }
                      value={data?.message}
                    />
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
                disabled={loading || isSubmitting}
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
                'Send Sample Request'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SampleRequestModal;

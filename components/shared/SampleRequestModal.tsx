'use client';
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Button } from '../ui/button';
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
import { Grade, SampleRequestModalProps, Country } from '@/types/shared';
import { MemoizedInput, MemoizedTextarea, MemoizedSearchableDropdown } from '@/components/shared/MemoizedFormComponents';
import { getCountryList } from '@/lib/useCountries';

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

  // Memoized initial data to prevent recreating on every render
  const initialData = useMemo(
    () => ({
      product: productId,
      quantity: '',
      sampleSize: '',
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
  
  // Use ref to track latest data for submission without causing re-renders
  const dataRef = useRef(data);
  
  // Keep ref in sync with state
  useEffect(() => {
    dataRef.current = data;
  }, [data]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarOpen2, setCalendarOpen2] = useState(false);

  // Refs for calendar containers to detect outside clicks
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarRef2 = useRef<HTMLDivElement>(null);

  // Validation function - runs on submit
  const validateForm = useCallback(() => {
    const errors: string[] = [];

    if (!dataRef.current.quantity) errors.push('Please enter the quantity');
    if (!dataRef.current.sampleSize) errors.push('Please enter the sample size');
    if (!dataRef.current.uom) errors.push('Please enter the unit of measurement');
    if (!dataRef.current.address) errors.push('Please enter the address');
    if (!dataRef.current.country) errors.push('Please enter the country');

    return { isValid: errors.length === 0, errors };
  }, []);

  // Memoized dropdown loading function
  const loadDropdowns = useCallback(async () => {
    if (dropdownsLoaded) return;

    try {
      setLoading(true);
      const gradesRes = await getGrades();
      setGrades(gradesRes.data);
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
      toast.error('Please login to request a sample.');
      router.push('/auth/login');
    }
  }, [token, loadDropdowns, router]);

  // Optimized field change handler using functional updates
  const onFieldChange = useCallback(
    (field: string, value: string | Date | undefined) => {
      setData((prev) => ({
        ...prev,
        [field]: value instanceof Date ? value : value || '',
      }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    // Validate form on submit
    const { isValid, errors } = validateForm();

    if (!isValid) {
      errors.forEach((err: string) => toast.error(err));
      setIsSubmitting(false);
      return;
    }

    const toastId = toast.loading('Creating Sample Request...');

    try {
      await createSampleRequest(dataRef.current);
      toast.dismiss(toastId);
      toast.success('Sample request created successfully!');
      setOpen(false);

      // Reset form on success
      setData(initialData);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Failed to create sample request. Please try again.');
      console.error('Sample request error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, initialData]);

  // Handle click outside calendars to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setCalendarOpen(false);
      }
      if (calendarRef2.current && !calendarRef2.current.contains(event.target as Node)) {
        setCalendarOpen2(false);
      }
    };

    if (calendarOpen || calendarOpen2) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [calendarOpen, calendarOpen2]);

  // Helper function for date formatting
  const formatDateDisplay = useCallback((date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

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
                      <label className="text-sm font-medium text-gray-700">Sample Size *</label>
                      <MemoizedInput
                        placeholder="Enter sample size (e.g., 5kg, 100g)"
                        className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          onFieldChange('sampleSize', e.target.value)
                        }
                        value={data?.sampleSize}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Grade</label>
                      <MemoizedSearchableDropdown
                        value={data.grade}
                        onValueChange={(value: string) => onFieldChange('grade', value)}
                        placeholder="Select product grade"
                        options={grades}
                        className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
                      />
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
                          value={data?.neededBy ? formatDateDisplay(data.neededBy) : ''}
                          placeholder="When do you need this sample?"
                          onFocus={() => setCalendarOpen2(true)}
                          className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 cursor-pointer pr-10"
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        {calendarOpen2 && (
                          <div ref={calendarRef2} className="absolute z-50 top-full mt-2 bg-white shadow-xl rounded-xl border border-gray-200 p-4">
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
                          value={data?.orderDate ? formatDateDisplay(data.orderDate) : ''}
                          placeholder="When might you place an order?"
                          onFocus={() => setCalendarOpen(true)}
                          className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 cursor-pointer pr-10"
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        {calendarOpen && (
                          <div ref={calendarRef} className="absolute z-50 top-full mt-2 bg-white shadow-xl rounded-xl border border-gray-200 p-4">
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Country *</label>
                    <MemoizedSearchableDropdown
                      options={countries.map(c => ({ _id: c.name, name: c.name }))}
                      value={data.country || ''}
                      onValueChange={(value: string) => onFieldChange('country', value)}
                      placeholder="Select destination country"
                      className="bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
                    />
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
              disabled={loading || isSubmitting}
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

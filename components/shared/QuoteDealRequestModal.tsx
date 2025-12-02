"use client";
import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Calendar as CalendarIcon, MapPin, Package, Truck, Clock, Gift } from "lucide-react";
import { createDealQuoteRequest } from "@/apiServices/user";
import { useRouter } from "next/navigation";
import { DealQuoteRequest } from "@/types/quote";
import { getCountryList } from "@/lib/useCountries";
import Cookies from "js-cookie";
import { QuoteDealRequestModalProps } from "@/types/shared";

// Payment terms options
const PAYMENT_TERMS = [
  "Cash on Delivery (COD)",
  "Letter of Credit (L/C)",
  "Telegraphic Transfer (T/T)",
  "Documents Against Payment (D/P)",
  "Documents Against Acceptance (D/A)",
  "Open Account",
  "Advance Payment",
  "Net 30 days",
  "Net 60 days",
  "Net 90 days",
];

// Memoized input components
const MemoizedInput = React.memo(({
  placeholder,
  value,
  onChange,
  type = "text",
  ...props
}: {
  placeholder: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  [key: string]: unknown;
}) => (
  <Input
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    type={type}
    {...props}
  />
));

const MemoizedTextarea = React.memo(({
  placeholder,
  value,
  onChange,
  ...props
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  [key: string]: unknown;
}) => (
  <Textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    {...props}
  />
));

const MemoizedSelect = React.memo(({
  value,
  onValueChange,
  options,
  ...props
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  [key: string]: unknown;
}) => (
  <Select value={value} onValueChange={onValueChange} {...props}>
    <SelectTrigger>
      <SelectValue placeholder="Select" />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem key={option} value={option}>
          {option}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
));

MemoizedInput.displayName = 'MemoizedInput';
MemoizedTextarea.displayName = 'MemoizedTextarea';
MemoizedSelect.displayName = 'MemoizedSelect';

const QuoteDealRequestModal = ({
  className,
  dealId,
  dealProduct,
  dealSupplier,
  dealMinQuantity,
  dealPrice,
  buttonText = "Grab This Deal",
  children,
}: QuoteDealRequestModalProps) => {
  const token = Cookies.get("token");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Get countries list
  const countries = useMemo(() => getCountryList(), []);
  
  // Initial form data
  const initialData = useMemo(() => ({
    requestType: "deal_quote" as const,
    bestDealId: dealId,
    desiredQuantity: 0,
    shippingCountry: "",
    paymentTerms: "",
    deliveryDeadline: undefined as Date | undefined,
    message: "",
    open_request: false,
    sourceSection: "special_offers" as const,
  }), [dealId]);

  // Form state
  const [data, setData] = useState(initialData);
  const dataRef = useRef<Partial<DealQuoteRequest>>(initialData);
  
  // Validation
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Validation logic
  const validateForm = useCallback(() => {
    const errors: string[] = [];
    const currentData = dataRef.current;
    
    if (!currentData.desiredQuantity || currentData.desiredQuantity <= 0) {
      errors.push("Desired quantity is required and must be greater than 0");
    }
    
    if (!currentData.shippingCountry?.trim()) {
      errors.push("Shipping country is required");
    }
    
    if (!currentData.paymentTerms?.trim()) {
      errors.push("Payment terms are required");
    }
    
    if (!currentData.deliveryDeadline) {
      errors.push("Delivery deadline is required");
    } else if (currentData.deliveryDeadline <= new Date()) {
      errors.push("Delivery deadline must be in the future");
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  }, []);

  // Update helper with debounced validation
  const updateField = useCallback(<T extends object>(field: keyof T, value: T[keyof T]) => {
    dataRef.current = { ...dataRef.current, [field]: value };
    setData(prev => ({ ...prev, [field]: value }));
    
    // Clear existing timeout
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }
    
    // Set new timeout for validation
    validationTimeoutRef.current = setTimeout(() => {
      validateForm();
    }, 300);
  }, [validateForm]);

  // Format date for display
  const formatDate = useCallback((date: Date | undefined) => {
    if (!date) return "Select delivery deadline";
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    if (!token) {
      toast.error("You must be logged in to request a quote.");
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Creating deal quote request...");

    try {
      // Prepare submission data with conditional fields
      const submitData: DealQuoteRequest = {
        requestType: "deal_quote",
        bestDealId: dataRef.current.bestDealId!,
        desiredQuantity: dataRef.current.desiredQuantity!,
        shippingCountry: dataRef.current.shippingCountry!,
        paymentTerms: dataRef.current.paymentTerms!,
        deliveryDeadline: dataRef.current.deliveryDeadline!,
        // Optional fields - only include if they have values
        ...(dataRef.current.message && dataRef.current.message.trim() && { message: dataRef.current.message }),
        open_request: dataRef.current.open_request || false,
        sourceSection: "special_offers" as const,
      };
      
      await createDealQuoteRequest(submitData);
      toast.dismiss(toastId);
      toast.success("Deal quote request created successfully!");
      setOpen(false);
      
      // Reset form on success
      const resetData = { ...initialData };
      dataRef.current = resetData;
      setData(resetData);
      setValidationErrors([]);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to create deal quote request. Please try again.");
      console.error("Deal quote request error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, initialData, token, router]);

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

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarOpen) {
        const target = event.target as Element;
        if (!target.closest('.calendar-container') && !target.closest('.calendar-input')) {
          setCalendarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [calendarOpen]);

  return (
    <>
      {children ? (
        <div onClick={() => setOpen(true)} className={className}>
          {children}
        </div>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          className={`w-full bg-primary-500 text-white py-2 rounded font-medium border border-primary-600 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm focus:ring-offset-2 group ${className}`}
        >
          <Gift className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="tracking-tight">{buttonText}</span>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
          <DialogHeader className="space-y-3 flex-shrink-0">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Request Deal Quote
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Fill out the form below to request a quote for this special deal.
            </DialogDescription>
            
            {/* Deal Information */}
            <div className="bg-primary-50 border border-primary-500/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-primary-500">
                <Gift className="w-4 h-4" />
                <span className="font-medium text-sm">Deal Information</span>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Product:</span> {dealProduct}</p>
                <p><span className="font-medium">Supplier:</span> {dealSupplier}</p>
                <p><span className="font-medium">Min Quantity:</span> {dealMinQuantity}</p>
                <p><span className="font-medium">Deal Price:</span> ${dealPrice.toLocaleString()}</p>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Please fix the following errors:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Package className="w-4 h-4" />
                Desired Quantity <span className="text-red-500">*</span>
              </label>
              <MemoizedInput
                type="number"
                min="1"
                placeholder="Enter desired quantity"
                value={data.desiredQuantity || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  updateField("desiredQuantity", parseInt(e.target.value) || 0)
                }
                className="w-full"
              />
            </div>

            {/* Shipping Country */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="w-4 h-4" />
                Shipping Country <span className="text-red-500">*</span>
              </label>
              <MemoizedSelect
                value={data.shippingCountry}
                onValueChange={(value: string) => updateField("shippingCountry", value)}
                options={countries.map(country => country.name)}
                className="w-full"
              />
            </div>

            {/* Payment Terms */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Truck className="w-4 h-4" />
                Payment Terms <span className="text-red-500">*</span>
              </label>
              <MemoizedSelect
                value={data.paymentTerms}
                onValueChange={(value: string) => updateField("paymentTerms", value)}
                options={PAYMENT_TERMS}
                className="w-full"
              />
            </div>

            {/* Delivery Deadline */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4" />
                Delivery Deadline <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MemoizedInput
                  type="text"
                  readOnly
                  value={formatDate(data.deliveryDeadline)}
                  placeholder="Select delivery deadline"
                  onFocus={() => setCalendarOpen(true)}
                  className="calendar-input bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 cursor-pointer pr-10"
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                {calendarOpen && (
                  <div className="calendar-container absolute z-50 top-full mt-2 bg-white shadow-xl rounded-xl border border-gray-200 p-4">
                    <Calendar
                      mode="single"
                      selected={data.deliveryDeadline}
                      onSelect={(date) => {
                        if (date) {
                          updateField("deliveryDeadline", date);
                          setCalendarOpen(false);
                        }
                      }}
                      disabled={(date) => date <= new Date()}
                      className="rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Additional Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Additional Message (Optional)
              </label>
              <MemoizedTextarea
                placeholder="Any additional requirements or comments..."
                value={data.message || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                  updateField("message", e.target.value)
                }
                className="w-full min-h-[60px]"
              />
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || validationErrors.length > 0}
              className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600"
            >
              {isSubmitting ? "Submitting..." : "Submit Quote Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuoteDealRequestModal;
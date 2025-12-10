'use client';

import { Calendar as CalendarIcon, MapPin, Truck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { SearchableDropdown } from '@/components/shared/SearchableDropdown';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownOption } from '@/types/shared';

interface DeliveryLogisticsSectionProps {
  desiredDeliveryDate: Date | undefined;
  destination: string;
  country: string;
  paymentTerms: string;
  requireLogisticsSupport: string;
  previousPurchaseHistory: string;
  additionalNotes: string;
  countryOptions: DropdownOption[];
  paymentTermsOptions: DropdownOption[];
  logisticsOptions: DropdownOption[];
  onDeliveryDateChange: (date: Date | undefined) => void;
  onDestinationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCountryChange: (value: string) => void;
  onPaymentTermsChange: (value: string) => void;
  onLogisticsChange: (value: string) => void;
  onPreviousPurchaseChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAdditionalNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function DeliveryLogisticsSection({
  desiredDeliveryDate,
  destination,
  country,
  paymentTerms,
  requireLogisticsSupport,
  previousPurchaseHistory,
  additionalNotes,
  countryOptions,
  paymentTermsOptions,
  logisticsOptions,
  onDeliveryDateChange,
  onDestinationChange,
  onCountryChange,
  onPaymentTermsChange,
  onLogisticsChange,
  onPreviousPurchaseChange,
  onAdditionalNotesChange,
}: DeliveryLogisticsSectionProps) {
  return (
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
              {desiredDeliveryDate ? (
                desiredDeliveryDate.toLocaleDateString()
              ) : (
                <span className="text-gray-500">Select delivery date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={desiredDeliveryDate}
              onSelect={onDeliveryDateChange}
              disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
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
          value={destination}
          onChange={onDestinationChange}
          className="h-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter delivery destination"
        />
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Country</label>
        <SearchableDropdown
          options={countryOptions}
          value={country}
          onValueChange={onCountryChange}
          placeholder="Select country"
          searchPlaceholder="Search countries..."
          emptyText="No country found"
          className="h-10"
        />
      </div>

      {/* Payment Terms */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Payment Terms
        </label>
        <SearchableDropdown
          options={paymentTermsOptions}
          value={paymentTerms}
          onValueChange={onPaymentTermsChange}
          placeholder="Select payment terms"
          searchPlaceholder="Search payment terms..."
          emptyText="No payment terms found"
          className="h-10"
        />
      </div>

      {/* Logistics Support */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <Truck className="w-4 h-4 inline mr-1.5 text-primary-600" />
          Require Logistics Support?
        </label>
        <SearchableDropdown
          options={logisticsOptions}
          value={requireLogisticsSupport}
          onValueChange={onLogisticsChange}
          placeholder="Select option"
          searchPlaceholder="Search..."
          emptyText="No options found"
          allowClear={false}
          className="h-10"
        />
      </div>

      {/* Previous Purchase History */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Previous Purchase History
        </label>
        <Textarea
          value={previousPurchaseHistory}
          onChange={onPreviousPurchaseChange}
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
          value={additionalNotes}
          onChange={onAdditionalNotesChange}
          className="min-h-[80px] border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Any additional information or special requirements..."
          rows={3}
        />
      </div>
    </div>
  );
}

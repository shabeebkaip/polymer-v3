'use client';

import { Banknote } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PricingCalculatorProps {
  estimatedPrice: number;
  estimatedPriceInput: string;
  monthlyEMI: string;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceBlur: () => void;
}

export function PricingCalculator({
  estimatedPrice,
  estimatedPriceInput,
  monthlyEMI,
  onPriceChange,
  onPriceBlur,
}: PricingCalculatorProps) {
  return (
    <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            <Banknote className="w-4 h-4 inline mr-1.5 text-primary-600" />
            Estimated Price ($)
          </label>
          <Input
            type="text"
            value={estimatedPriceInput || (estimatedPrice === 0 ? '' : estimatedPrice.toString())}
            onChange={onPriceChange}
            onBlur={onPriceBlur}
            className="h-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            placeholder="Enter price"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Monthly EMI ($)
          </label>
          <div className="h-10 px-3 bg-white border border-gray-300 rounded-lg text-base font-semibold text-primary-600 flex items-center">
            ${monthlyEMI}
          </div>
        </div>
      </div>
    </div>
  );
}

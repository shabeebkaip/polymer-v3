'use client';

import { ArrowLeft, CreditCard, DollarSign, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreateFinanceHeaderProps {
  onBack: () => void;
}

export function CreateFinanceHeader({ onBack }: CreateFinanceHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
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
  );
}

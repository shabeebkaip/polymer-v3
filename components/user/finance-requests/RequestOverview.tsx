import React from 'react';
import { DollarSign, Calculator, Target, Banknote, FileText, Truck } from 'lucide-react';

interface RequestOverviewProps {
  estimatedPrice: number;
  emiMonths: number;
  quantity: number;
  paymentTerms: string;
  requireLogisticsSupport: string;
  notes?: string;
  formatCurrency: (amount: number) => string;
  calculateMonthlyEMI: (price: number, months: number) => string;
  getPaymentTermsText: (terms: string) => string;
}

export const RequestOverview: React.FC<RequestOverviewProps> = ({
  estimatedPrice,
  emiMonths,
  quantity,
  paymentTerms,
  requireLogisticsSupport,
  notes,
  formatCurrency,
  calculateMonthlyEMI,
  getPaymentTermsText
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Banknote className="w-5 h-5 text-green-600" />
        Finance Request Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Estimated Price</p>
              <p className="font-semibold text-gray-900 text-sm">
                {estimatedPrice > 0 ? formatCurrency(estimatedPrice) : 'Not specified'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calculator className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">EMI Duration</p>
              <p className="font-semibold text-gray-900 text-sm">{emiMonths} months</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Target className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Quantity</p>
              <p className="font-semibold text-gray-900 text-sm">{quantity.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {estimatedPrice > 0 && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Banknote className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Monthly EMI</p>
                <p className="font-semibold text-gray-900 text-sm">
                  ${calculateMonthlyEMI(estimatedPrice, emiMonths)}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <FileText className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Payment Terms</p>
              <p className="font-semibold text-gray-900 text-sm">{getPaymentTermsText(paymentTerms)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Truck className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Logistics Support</p>
              <p className="font-semibold text-gray-900 text-sm">{requireLogisticsSupport}</p>
            </div>
          </div>
        </div>
      </div>

      {notes && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4" />
            Request Notes
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">{notes}</p>
        </div>
      )}
    </div>
  );
};

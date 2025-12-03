import React from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FinanceRequestHeaderProps {
  requestId: string;
  status: string;
  onBack: () => void;
  getStatusBadge: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusText: (status: string) => string;
}

export const FinanceRequestHeader: React.FC<FinanceRequestHeaderProps> = ({
  requestId,
  status,
  onBack,
  getStatusBadge,
  getStatusIcon,
  getStatusText
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Finance Request</h1>
              <p className="text-gray-600 text-sm">ID: #{requestId.slice(-8)}</p>
            </div>
          </div>
        </div>
        <div className={getStatusBadge(status)}>
          {getStatusIcon(status)}
          <span>{getStatusText(status)}</span>
        </div>
      </div>
    </div>
  );
};

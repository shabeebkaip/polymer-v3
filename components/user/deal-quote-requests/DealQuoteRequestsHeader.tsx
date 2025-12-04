import React from 'react';
import { Gift, Clock, CheckCircle, MessageSquare } from 'lucide-react';

interface DealQuoteRequestsHeaderProps {
  totalRequests: number;
  pendingCount: number;
  respondedCount: number;
  acceptedCount: number;
}

export const DealQuoteRequestsHeader: React.FC<DealQuoteRequestsHeaderProps> = ({
  totalRequests,
  pendingCount,
  respondedCount,
  acceptedCount
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary-500 p-2.5 rounded-lg">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Deal Quote Requests
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">
              Track and manage your special deal quote requests
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium mb-1">Total Requests</p>
              <p className="text-2xl font-semibold text-gray-900">{totalRequests}</p>
            </div>
            <div className="bg-primary-100 p-2 rounded-lg">
              <Gift className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium mb-1">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingCount}</p>
            </div>
            <div className="bg-amber-100 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium mb-1">Accepted</p>
              <p className="text-2xl font-semibold text-gray-900">{acceptedCount}</p>
            </div>
            <div className="bg-emerald-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium mb-1">Responded</p>
              <p className="text-2xl font-semibold text-gray-900">{respondedCount}</p>
            </div>
            <div className="bg-primary-100 p-2 rounded-lg">
              <MessageSquare className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

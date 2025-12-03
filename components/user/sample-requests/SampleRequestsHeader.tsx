import React from 'react';
import { Package, Clock, CheckCircle } from 'lucide-react';

interface SampleRequestsHeaderProps {
  totalRequests: number;
  pendingCount: number;
  deliveredCount: number;
  approvedCount: number;
}

export const SampleRequestsHeader: React.FC<SampleRequestsHeaderProps> = ({
  totalRequests,
  pendingCount,
  deliveredCount,
  approvedCount
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2.5 rounded-lg">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Sample Requests
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">
              Track and manage your sample requests
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
            <div className="bg-green-100 p-2 rounded-lg">
              <Package className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium mb-1">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingCount}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium mb-1">Delivered</p>
              <p className="text-2xl font-semibold text-gray-900">{deliveredCount}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium mb-1">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">{approvedCount}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

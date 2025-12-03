import React from 'react';
import { FileText, Clock, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FinanceRequestsHeaderProps {
  totalRequests: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export const FinanceRequestsHeader: React.FC<FinanceRequestsHeaderProps> = ({
  totalRequests,
  pendingCount,
  approvedCount,
  rejectedCount
}) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2.5 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Finance Requests
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">
              Manage and track your finance requests
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push('/user/finance-requests/add')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <CreditCard className="w-4 h-4" />
          Request Finance
        </button>
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
              <FileText className="w-5 h-5 text-green-600" />
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
              <p className="text-gray-600 text-xs font-medium mb-1">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">{approvedCount}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs font-medium mb-1">Rejected</p>
              <p className="text-2xl font-semibold text-gray-900">{rejectedCount}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

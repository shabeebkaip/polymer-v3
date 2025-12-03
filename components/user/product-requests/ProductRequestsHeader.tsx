import React from 'react';
import { useRouter } from 'next/navigation';
import { Package, FileText, Clock, CheckCircle, Activity, Truck, XCircle } from 'lucide-react';

interface ProductRequestsHeaderProps {
  stats: {
    total: number;
    pending: number;
    accepted: number;
    in_progress: number;
    shipped: number;
    delivered: number;
    completed: number;
    rejected: number;
  };
}

export const ProductRequestsHeader: React.FC<ProductRequestsHeaderProps> = ({ stats }) => {
  const router = useRouter();

  const statsData = [
    { label: 'Total Requests', value: stats.total, icon: FileText, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { label: 'Accepted', value: stats.accepted, icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'In Progress', value: stats.in_progress, icon: Activity, color: 'text-teal-600', bgColor: 'bg-teal-50' },
    { label: 'Shipped', value: stats.shipped, icon: Truck, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Delivered', value: stats.delivered, icon: Package, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2.5 rounded-lg">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Sourcing Requests
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">
              Manage and track your bulk product orders
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push('/user/product-requests/add')}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
        >
          <Package className="w-4 h-4" />
          <span>New Request</span>
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600 font-medium leading-tight">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

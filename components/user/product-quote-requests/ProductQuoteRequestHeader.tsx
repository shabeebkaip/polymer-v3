import React from 'react';
import { useRouter } from 'next/navigation';
import { Package, ArrowLeft } from 'lucide-react';

interface ProductQuoteRequestHeaderProps {
  requestId: string;
  status: string;
  createdAt: string;
  getStatusBadge: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusText: (status: string) => string;
}

export const ProductQuoteRequestHeader: React.FC<ProductQuoteRequestHeaderProps> = ({
  requestId,
  status,
  createdAt,
  getStatusBadge,
  getStatusIcon,
  getStatusText,
}) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <button
        onClick={() => router.push('/user/quote-requests/product')}
        className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary-600 p-2.5 rounded-lg">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Product Quote Request Details
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">
              Request ID: #{requestId.slice(-8).toUpperCase()} • {new Date(createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        <span className={getStatusBadge(status)}>
          {getStatusIcon(status)}
          {getStatusText(status)}
        </span>
      </div>
    </div>
  );
};

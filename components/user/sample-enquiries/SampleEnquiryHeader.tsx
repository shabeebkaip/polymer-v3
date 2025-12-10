import React from 'react';
import { useRouter } from 'next/navigation';
import { FlaskConical, ArrowLeft } from 'lucide-react';
import { StatusConfig } from '@/lib/config/status.config';

interface SampleEnquiryHeaderProps {
  enquiryId: string;
  status: string;
  statusConfig: StatusConfig;
  canUpdate?: boolean;
  onUpdateClick?: () => void;
}

export const SampleEnquiryHeader: React.FC<SampleEnquiryHeaderProps> = ({
  enquiryId,
  statusConfig,
  canUpdate = false,
  onUpdateClick,
}) => {
  const router = useRouter();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <button
        onClick={() => router.push('/user/sample-enquiries')}
        className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2.5 rounded-lg">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Sample Enquiry Details
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">
              Enquiry ID: #{enquiryId.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}>
            <StatusIcon className="w-5 h-5" />
            {statusConfig.text}
          </span>
          {canUpdate && onUpdateClick && (
            <button
              onClick={onUpdateClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Update Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

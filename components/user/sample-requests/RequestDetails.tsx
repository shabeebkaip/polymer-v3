import React from 'react';
import { Package, Target, Calendar, Factory, FileText, Download } from 'lucide-react';

interface RequestDetailsProps {
  quantity: number;
  uom: string;
  expected_annual_volume: number;
  neededBy: string;
  application: string;
  message: string;
  request_document?: string;
}

export const RequestDetails: React.FC<RequestDetailsProps> = ({
  quantity,
  uom,
  expected_annual_volume,
  neededBy,
  application,
  message,
  request_document,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Request Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-gray-400" />
            <p className="text-xs text-gray-600">Quantity</p>
          </div>
          <p className="font-semibold text-base text-gray-900">{quantity} {uom}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-gray-400" />
            <p className="text-xs text-gray-600">Annual Volume</p>
          </div>
          <p className="font-semibold text-base text-gray-900">{expected_annual_volume.toLocaleString()} {uom}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <p className="text-xs text-gray-600">Needed By</p>
          </div>
          <p className="text-sm font-medium text-gray-900">
            {new Date(neededBy).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Factory className="w-4 h-4 text-gray-400" />
            Application
          </h4>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{application}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            Message
          </h4>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{message}</p>
        </div>
      </div>

      {request_document && (
        <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-1.5 rounded-lg">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Attached Document</p>
                <p className="text-xs text-blue-700">{request_document}</p>
              </div>
            </div>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-3 h-3" />
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

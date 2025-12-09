import React from 'react';
import { FileText, Package, Target, Calendar, Factory, Download } from 'lucide-react';

interface EnquiryDetailsProps {
  quantity: number;
  uom?: string;
  expectedAnnualVolume?: number;
  neededBy?: string;
  application?: string;
  message?: string;
  requestDocument?: string;
}

export const EnquiryDetails: React.FC<EnquiryDetailsProps> = ({
  quantity,
  uom,
  expectedAnnualVolume,
  neededBy,
  application,
  message,
  requestDocument,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-green-600" />
        <h2 className="text-lg font-semibold text-gray-900">Enquiry Details</h2>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-gray-400" />
            <p className="text-xs text-gray-600">Quantity</p>
          </div>
          <p className="font-semibold text-gray-900">
            {quantity.toLocaleString()} {uom}
          </p>
        </div>

        {expectedAnnualVolume && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-600">Annual Volume</p>
            </div>
            <p className="font-semibold text-gray-900">
              {expectedAnnualVolume.toLocaleString()} {uom}
            </p>
          </div>
        )}

        {neededBy && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-600">Needed By</p>
            </div>
            <p className="font-medium text-gray-900">
              {new Date(neededBy).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {application && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Factory className="w-4 h-4 text-gray-600" />
              <p className="text-sm font-medium text-gray-900">Application</p>
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{application}</p>
          </div>
        )}

        {message && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-600" />
              <p className="text-sm font-medium text-gray-900">Message</p>
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{message}</p>
          </div>
        )}

        {requestDocument && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Attached Document</p>
                  <p className="text-xs text-blue-700">{requestDocument}</p>
                </div>
              </div>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

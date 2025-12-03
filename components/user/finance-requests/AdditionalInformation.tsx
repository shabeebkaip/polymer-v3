import React from 'react';
import { FileText } from 'lucide-react';

interface AdditionalInformationProps {
  previousPurchaseHistory?: string;
  additionalNotes?: string;
}

export const AdditionalInformation: React.FC<AdditionalInformationProps> = ({
  previousPurchaseHistory,
  additionalNotes
}) => {
  if (!previousPurchaseHistory && !additionalNotes) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-green-600" />
        Additional Information
      </h2>
      
      <div className="space-y-4">
        {previousPurchaseHistory && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Previous Purchase History</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{previousPurchaseHistory}</p>
          </div>
        )}
        
        {additionalNotes && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Additional Notes</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{additionalNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

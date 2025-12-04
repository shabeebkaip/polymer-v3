import React from 'react';
import { Factory, Building2, Mail, Phone } from 'lucide-react';

interface SupplierInformationProps {
  seller: {
    _id: string;
    name: string;
    email: string;
    phone?: number;
    company?: string;
  };
}

export const SupplierInformation: React.FC<SupplierInformationProps> = ({ seller }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-orange-100 p-2 rounded-lg">
          <Factory className="w-5 h-5 text-orange-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">Supplier Details</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <Factory className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{seller.name}</p>
            {seller.company && <p className="text-xs text-gray-600">{seller.company}</p>}
          </div>
        </div>

        <div className="space-y-2">
          {seller.company && (
            <div className="flex items-center gap-2 text-gray-700">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{seller.company}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{seller.email}</span>
          </div>
          {seller.phone && (
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{seller.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

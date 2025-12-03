import React from 'react';
import { Factory, Building2, Mail, Phone, MapPin } from 'lucide-react';

interface SupplierInformationProps {
  supplier: {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
}

export const SupplierInformation: React.FC<SupplierInformationProps> = ({ supplier }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-orange-100 p-2 rounded-lg">
          <Factory className="w-4 h-4 text-orange-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">Supplier Details</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <Factory className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {supplier.firstName} {supplier.lastName}
            </p>
            <p className="text-xs text-gray-600">Supplier</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <Building2 className="w-3 h-3 text-gray-400" />
            <span className="text-xs">{supplier.company}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-3 h-3 text-gray-400" />
            <span className="text-xs">{supplier.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Phone className="w-3 h-3 text-gray-400" />
            <span className="text-xs">{supplier.phone}</span>
          </div>
          <div className="flex items-start gap-2 text-gray-700">
            <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
            <div className="text-xs">
              <p>{supplier.address}</p>
              <p>{supplier.city}, {supplier.state}</p>
              <p>{supplier.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { User, Building2, Mail, Phone, MapPin } from 'lucide-react';
import { InfoItem } from './InfoItem';

interface BuyerInformationProps {
  user: {
    name?: string;
    company?: string;
    email?: string;
    phone?: string;
  };
  address?: string;
  country?: string;
}

export const BuyerInformation: React.FC<BuyerInformationProps> = ({
  user,
  address,
  country,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Enquiry From</h3>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{user.name || 'N/A'}</p>
          <p className="text-xs text-gray-600">Buyer</p>
        </div>
      </div>

      <div className="space-y-3">
        <InfoItem
          label="Company"
          value={user.company}
          icon={<Building2 className="w-4 h-4 text-gray-400" />}
        />
        <InfoItem
          label="Email"
          value={user.email}
          icon={<Mail className="w-4 h-4 text-gray-400" />}
        />
        <InfoItem
          label="Phone"
          value={user.phone}
          icon={<Phone className="w-4 h-4 text-gray-400" />}
        />
        {(address || country) && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-600 mb-1">Address</p>
              <div className="text-sm text-gray-900">
                {address && <p>{address}</p>}
                {country && <p>{country}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

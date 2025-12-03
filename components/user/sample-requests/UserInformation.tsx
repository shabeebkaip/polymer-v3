import React from 'react';
import { User, Building2, Mail, Phone, MapPin } from 'lucide-react';

interface UserInformationProps {
  user: {
    firstName: string;
    lastName: string;
    userType: string;
    company: string;
    email: string;
    city: string;
    state: string;
    pincode: string;
  };
  phone: string;
  address: string;
  country: string;
}

export const UserInformation: React.FC<UserInformationProps> = ({
  user,
  phone,
  address,
  country,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-green-100 p-2 rounded-lg">
          <User className="w-4 h-4 text-green-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">Requested By</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-600">{user.userType}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <Building2 className="w-3 h-3 text-gray-400" />
            <span className="text-xs">{user.company}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-3 h-3 text-gray-400" />
            <span className="text-xs">{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Phone className="w-3 h-3 text-gray-400" />
            <span className="text-xs">{phone}</span>
          </div>
          <div className="flex items-start gap-2 text-gray-700">
            <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
            <div className="text-xs">
              <p>{address}</p>
              <p>{user.city}, {user.state}</p>
              <p>{country} - {user.pincode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

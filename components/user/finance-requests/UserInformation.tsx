import React from 'react';
import { User, Mail, Phone, Building2, MapPin } from 'lucide-react';

interface UserInformationProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    address: string;
  };
  title?: string;
}

export const UserInformation: React.FC<UserInformationProps> = ({ user, title = "Applicant Information" }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <User className="w-4 h-4 text-green-600" />
        {title}
      </h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-600">Name</p>
            <p className="font-medium text-gray-900 text-sm">
              {user.firstName} {user.lastName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-600">Email</p>
            <p className="font-medium text-gray-900 text-sm">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-600">Phone</p>
            <p className="font-medium text-gray-900 text-sm">{user.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Building2 className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-600">Company</p>
            <p className="font-medium text-gray-900 text-sm">{user.company}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-gray-400 mt-1" />
          <div>
            <p className="text-xs text-gray-600">Address</p>
            <p className="font-medium text-gray-900 text-sm">{user.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

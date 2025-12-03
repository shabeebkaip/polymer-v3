import React from 'react';
import { MapPin, Globe, CalendarDays, Shield } from 'lucide-react';

interface DeliveryInformationProps {
  country: string;
  destination?: string;
  desiredDeliveryDate?: string;
  productGrade?: string;
  formatDate: (date: string) => string;
}

export const DeliveryInformation: React.FC<DeliveryInformationProps> = ({
  country,
  destination,
  desiredDeliveryDate,
  productGrade,
  formatDate
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-green-600" />
        Delivery Information
      </h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Globe className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-600">Country</p>
            <p className="font-medium text-gray-900 text-sm">{country}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-600">Destination</p>
            <p className="font-medium text-gray-900 text-sm">{destination || 'Not specified'}</p>
          </div>
        </div>

        {desiredDeliveryDate && (
          <div className="flex items-center gap-3">
            <CalendarDays className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-600">Desired Delivery Date</p>
              <p className="font-medium text-gray-900 text-sm">{formatDate(desiredDeliveryDate)}</p>
            </div>
          </div>
        )}

        {productGrade && (
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-600">Product Grade</p>
              <p className="font-medium text-gray-900 text-sm">{productGrade}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

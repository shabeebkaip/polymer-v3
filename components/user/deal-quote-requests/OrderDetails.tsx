import React from 'react';
import { FileText, Package, MapPin, Calendar, CreditCard } from 'lucide-react';

interface OrderDetailsProps {
  orderDetails: {
    quantity: number;
    shippingCountry: string;
    paymentTerms: string;
    deliveryDeadline: string;
  };
  message?: string;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderDetails,
  message,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-600">Quantity</p>
          </div>
          <p className="text-base font-semibold text-gray-900">
            {orderDetails.quantity.toLocaleString()} units
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-600">Shipping Country</p>
          </div>
          <p className="text-base font-semibold text-gray-900">{orderDetails.shippingCountry}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-600">Payment Terms</p>
          </div>
          <p className="text-base font-semibold text-gray-900">{orderDetails.paymentTerms}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-600">Delivery Deadline</p>
          </div>
          <p className="text-base font-semibold text-gray-900">
            {new Date(orderDetails.deliveryDeadline).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {message && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-600" />
            Message
          </h4>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{message}</p>
        </div>
      )}
    </div>
  );
};

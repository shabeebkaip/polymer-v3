import React, { useState } from 'react';
import { FileText, Package, MapPin, Calendar, CreditCard, Truck, Tag, Box, ChevronDown, ChevronUp } from 'lucide-react';

interface OrderDetailsProps {
  orderDetails: {
    quantity: number;
    uom?: string;
    gradeId?: {
      _id: string;
      gradeName?: string;
      name?: string;
    };
    shippingCountry?: string;
    deliveryDeadline?: string;
    incotermId?: {
      _id: string;
      name: string;
    };
    packagingTypeId?: {
      _id: string;
      name: string;
    };
    paymentTerms?: string;
    application?: string;
    shippingAddress?: {
      address: string;
      city: string;
      state: string;
      country: string;
      pincode: string;
    };
    additionalRequirements?: string;
  };
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ orderDetails }) => {
  const [showAdditionalReq, setShowAdditionalReq] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

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
            {orderDetails.quantity.toLocaleString()} {orderDetails.uom || 'units'}
          </p>
        </div>

        {orderDetails.gradeId && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-4 h-4 text-gray-600" />
              <p className="text-xs text-gray-600">Grade</p>
            </div>
            <p className="text-base font-semibold text-gray-900">{orderDetails.gradeId.gradeName || orderDetails.gradeId.name}</p>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-600">Shipping Country</p>
          </div>
          <p className="text-base font-semibold text-gray-900">{orderDetails.shippingCountry || 'N/A'}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-600">Delivery Deadline</p>
          </div>
          <p className="text-base font-semibold text-gray-900">
            {orderDetails.deliveryDeadline ? new Date(orderDetails.deliveryDeadline).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : 'N/A'}
          </p>
        </div>

        {orderDetails.incotermId && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Truck className="w-4 h-4 text-gray-600" />
              <p className="text-xs text-gray-600">Incoterm</p>
            </div>
            <p className="text-base font-semibold text-gray-900">{orderDetails.incotermId.name}</p>
          </div>
        )}

        {orderDetails.packagingTypeId && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Box className="w-4 h-4 text-gray-600" />
              <p className="text-xs text-gray-600">Packaging Type</p>
            </div>
            <p className="text-base font-semibold text-gray-900">{orderDetails.packagingTypeId.name}</p>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-3 col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-600">Payment Terms</p>
          </div>
          <p className="text-base font-semibold text-gray-900">{orderDetails.paymentTerms}</p>
        </div>

        {orderDetails.application && (
          <div className="bg-gray-50 rounded-lg p-3 col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-gray-600" />
              <p className="text-xs text-gray-600">Application</p>
            </div>
            <p className="text-base font-semibold text-gray-900">{orderDetails.application}</p>
          </div>
        )}
      </div>

      {orderDetails.additionalRequirements && (
        <div className="mt-4">
          <button
            onClick={() => setShowAdditionalReq(!showAdditionalReq)}
            className="flex items-center justify-between w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">Additional Requirements</span>
            {showAdditionalReq ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {showAdditionalReq && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{orderDetails.additionalRequirements}</p>
            </div>
          )}
        </div>
      )}

      {orderDetails.shippingAddress && (
        <div className="mt-4">
          <button
            onClick={() => setShowAddress(!showAddress)}
            className="flex items-center justify-between w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              Shipping Address
            </span>
            {showAddress ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {showAddress && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                {orderDetails.shippingAddress.address}<br />
                {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}<br />
                {orderDetails.shippingAddress.country} - {orderDetails.shippingAddress.pincode}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

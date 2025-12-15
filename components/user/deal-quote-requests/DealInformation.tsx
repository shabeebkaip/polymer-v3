import React from 'react';
import Image from 'next/image';
import { Gift, Layers } from 'lucide-react';

interface DealInformationProps {
  deal: {
    _id: string;
    product: {
      productName?: string;
      chemicalName?: string;
      tradeName?: string;
      description?: string;
      productImages?: Array<{
        id: string;
        fileUrl: string;
        name: string;
      }>;
      countryOfOrigin?: string;
      color?: string;
      density?: number;
      mfi?: number;
      manufacturingMethod?: string;
    };
  };
}

export const DealInformation: React.FC<DealInformationProps> = ({ deal }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-primary-100 p-2 rounded-lg">
          <Gift className="w-5 h-5 text-primary-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Deal Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              {deal.product.productName || 'N/A'}
            </h3>
            {deal.product.description && (
              <p className="text-sm text-gray-600">{deal.product.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {deal.product.chemicalName && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Chemical Name</p>
                <p className="text-sm font-medium text-gray-900">{deal.product.chemicalName}</p>
              </div>
            )}
            {deal.product.tradeName && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Trade Name</p>
                <p className="text-sm font-medium text-gray-900">{deal.product.tradeName}</p>
              </div>
            )}
            {deal.product.color && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Color</p>
                <p className="text-sm font-medium text-gray-900">{deal.product.color}</p>
              </div>
            )}
            {deal.product.countryOfOrigin && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Country of Origin</p>
                <p className="text-sm font-medium text-gray-900">{deal.product.countryOfOrigin}</p>
              </div>
            )}
            {deal.product.density && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Density</p>
                <p className="text-sm font-medium text-gray-900">{deal.product.density}</p>
              </div>
            )}
            {deal.product.mfi && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">MFI</p>
                <p className="text-sm font-medium text-gray-900">{deal.product.mfi}</p>
              </div>
            )}
            {deal.product.manufacturingMethod && (
              <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                <p className="text-xs text-gray-600 mb-1">Manufacturing Method</p>
                <p className="text-sm font-medium text-gray-900">
                  {deal.product.manufacturingMethod}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {deal.product.productImages && deal.product.productImages.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Product Images
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {deal.product.productImages.slice(0, 4).map((image) => (
                  <div key={image.id} className="relative group">
                    <Image
                      src={image.fileUrl}
                      alt={image.name}
                      className="w-full h-16 object-cover rounded-lg border border-blue-200"
                      width={64}
                      height={64}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg"></div>
                  </div>
                ))}
              </div>
              {deal.product.productImages.length > 4 && (
                <p className="text-xs text-blue-600 mt-1">
                  +{deal.product.productImages.length - 4} more
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

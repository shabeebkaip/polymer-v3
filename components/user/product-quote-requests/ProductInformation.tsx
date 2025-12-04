import React from 'react';
import Image from 'next/image';
import { Package, Layers } from 'lucide-react';

interface ProductInformationProps {
  product: {
    _id: string;
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
    density?: number | string;
    mfi?: number | string;
  };
}

export const ProductInformation: React.FC<ProductInformationProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-primary-100 p-2 rounded-lg">
          <Package className="w-5 h-5 text-primary-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Product Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              {product.productName || 'N/A'}
            </h3>
            {product.description && (
              <p className="text-sm text-gray-600">{product.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {product.chemicalName && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Chemical Name</p>
                <p className="text-sm font-medium text-gray-900">{product.chemicalName}</p>
              </div>
            )}
            {product.tradeName && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Trade Name</p>
                <p className="text-sm font-medium text-gray-900">{product.tradeName}</p>
              </div>
            )}
            {product.color && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Color</p>
                <p className="text-sm font-medium text-gray-900">{product.color}</p>
              </div>
            )}
            {product.countryOfOrigin && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Country of Origin</p>
                <p className="text-sm font-medium text-gray-900">{product.countryOfOrigin}</p>
              </div>
            )}
            {product.density && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Density</p>
                <p className="text-sm font-medium text-gray-900">{product.density}</p>
              </div>
            )}
            {product.mfi && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">MFI</p>
                <p className="text-sm font-medium text-gray-900">{product.mfi}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {product.productImages && product.productImages.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Product Images
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {product.productImages.slice(0, 4).map((image) => (
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
              {product.productImages.length > 4 && (
                <p className="text-xs text-blue-600 mt-1">
                  +{product.productImages.length - 4} more
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

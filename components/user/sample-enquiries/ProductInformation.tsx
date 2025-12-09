import React from 'react';
import { Package, Layers } from 'lucide-react';
import Image from 'next/image';

interface ProductInformationProps {
  product: {
    productName?: string;
    description?: string;
    chemicalName?: string;
    tradeName?: string;
    color?: string;
    countryOfOrigin?: string;
    manufacturingMethod?: string;
    productImages?: Array<{
      id: string;
      name: string;
      fileUrl: string;
    }>;
  };
  grade?: {
    name?: string;
    description?: string;
  };
}

export const ProductInformation: React.FC<ProductInformationProps> = ({
  product,
  grade,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-green-600" />
        <h2 className="text-lg font-semibold text-gray-900">Product Information</h2>
      </div>

      <div className="space-y-6">
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
            <div>
              <p className="text-xs text-gray-600 mb-1">Chemical Name</p>
              <p className="text-sm font-medium text-gray-900">{product.chemicalName}</p>
            </div>
          )}
          {product.tradeName && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Trade Name</p>
              <p className="text-sm font-medium text-gray-900">{product.tradeName}</p>
            </div>
          )}
          {product.color && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Color</p>
              <p className="text-sm font-medium text-gray-900">{product.color}</p>
            </div>
          )}
          {product.countryOfOrigin && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Country of Origin</p>
              <p className="text-sm font-medium text-gray-900">{product.countryOfOrigin}</p>
            </div>
          )}
          {product.manufacturingMethod && (
            <div className="col-span-2">
              <p className="text-xs text-gray-600 mb-1">Manufacturing Method</p>
              <p className="text-sm font-medium text-gray-900">{product.manufacturingMethod}</p>
            </div>
          )}
        </div>

        {grade && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-xs text-green-600 mb-1">Grade</p>
            <p className="font-medium text-green-900">{grade.name}</p>
            {grade.description && (
              <p className="text-sm text-green-700 mt-1">{grade.description}</p>
            )}
          </div>
        )}

        {product.productImages && product.productImages.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-gray-600" />
              <p className="text-sm font-medium text-gray-900">Product Images</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.productImages.slice(0, 4).map((image) => (
                <div key={image.id} className="relative aspect-square">
                  <Image
                    src={image.fileUrl}
                    alt={image.name}
                    fill
                    className="object-cover rounded-lg border border-gray-200"
                    sizes="(max-width: 768px) 100px, 120px"
                  />
                </div>
              ))}
            </div>
            {product.productImages.length > 4 && (
              <p className="text-xs text-gray-500 mt-2">
                +{product.productImages.length - 4} more
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Package } from 'lucide-react';
import Image from 'next/image';

interface ProductInformationProps {
  product: {
    productImages?: Array<{ fileUrl: string }>;
    productName: string;
    chemicalName: string;
    tradeName: string;
    color: string;
    countryOfOrigin: string;
    manufacturingMethod: string;
    description?: string;
  };
}

export const ProductInformation: React.FC<ProductInformationProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-green-600" />
        Product Information
      </h2>
      
      <div className="flex gap-4">
        {product.productImages && product.productImages.length > 0 && (
          <div className="flex-shrink-0">
            <Image
              src={product.productImages[0].fileUrl}
              alt={product.productName}
              width={96}
              height={96}
              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
            />
          </div>
        )}
        
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">{product.productName}</h3>
            <p className="text-gray-600 text-sm">{product.chemicalName}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-600">Trade Name</p>
              <p className="font-medium text-gray-900 text-sm">{product.tradeName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Color</p>
              <p className="font-medium text-gray-900 text-sm">{product.color}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Country of Origin</p>
              <p className="font-medium text-gray-900 text-sm">{product.countryOfOrigin}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Manufacturing Method</p>
              <p className="font-medium text-gray-900 text-sm">{product.manufacturingMethod}</p>
            </div>
          </div>

          {product.description && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Description</p>
              <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

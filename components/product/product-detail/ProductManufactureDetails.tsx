import React from 'react';
import { ProductManufactureDetailsProps } from '@/types/product';
import ProductValueCard from '@/components/product/product-detail/ProductValueCard';

const ProductManufactureDetails: React.FC<ProductManufactureDetailsProps> = ({ product }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Manufacturing & Origin</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {product.manufacturingMethod ? (
          <ProductValueCard
            label="Manufacturing Method"
            value={product.manufacturingMethod || ''}
          />
        ) : null}
        {product.countryOfOrigin ? (
          <ProductValueCard label="Country of Origin" value={product.countryOfOrigin || ''} />
        ) : null}
        {product.packagingWeight ? (
          <ProductValueCard label="Packaging Weight" value={product.packagingWeight || ''} />
        ) : null}
      </div>
    </div>
  );
};

export default ProductManufactureDetails;

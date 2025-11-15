import { Product, ProductCertificationsProps } from '@/types/product';
import React from 'react';
import ProductValueCard from '@/components/product/product-detail/ProductValueCard';

const ProductCertifications: React.FC<ProductCertificationsProps> = ({ product }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications & Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {product.recyclable ? (
          <ProductValueCard label="Recyclable" value="Eco-friendly material" />
        ) : null}
        {product.bioDegradable ? (
          <ProductValueCard label="Biodegradable" value="Environmentally safe" />
        ) : null}
        {product.fdaApproved ? (
          <ProductValueCard label="FDA Approved" value="Food contact safe" />
        ) : null}
        {product.medicalGrade ? (
          <ProductValueCard label="Medical Grade" value="Healthcare approved" />
        ) : null}
        {product.shelfLife ? (
          <ProductValueCard label="Shelf Life" value={product.shelfLife || ''} />
        ) : null}
      </div>
    </div>
  );
};

export default ProductCertifications;

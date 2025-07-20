import React from "react";
import { Product } from "@/types/product";
import ProductValueCard from "@/components/product/product-detail/ProductValueCard";

interface ProductTechnicalPropertiesProps {
  product: Product;
}

const ProductTechnicalProperties: React.FC<ProductTechnicalPropertiesProps> = ({ product }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Properties</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {product.density && product.density > 0 ? (
          <ProductValueCard label="Density" value={product.density} />
        ) : null}
        {product.mfi && product.mfi > 0 ? (
          <ProductValueCard label="MFI (g/10 min)" value={product.mfi} />
        ) : null}
        {product.tensileStrength && product.tensileStrength > 0 ? (
          <ProductValueCard label="Tensile Strength" value={`${product.tensileStrength} Mpa`} />
        ) : null}
        {product.elongationAtBreak && product.elongationAtBreak > 0 ? (
          <ProductValueCard label="Elongation at Break" value={`${product.elongationAtBreak}%`} />
        ) : null}
        {product.shoreHardness && product.shoreHardness > 0 ? (
          <ProductValueCard label="Shore Hardness" value={product.shoreHardness} />
        ) : null}
        {product.waterAbsorption && product.waterAbsorption > 0 ? (
          <ProductValueCard label="Water Absorption" value={`${product.waterAbsorption}%`} />
        ) : null}
      </div>
    </div>
  );
};

export default ProductTechnicalProperties;
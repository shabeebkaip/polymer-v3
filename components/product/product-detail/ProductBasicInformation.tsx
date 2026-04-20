import React from "react";
import { ProductBasicInformationProps } from "@/types/product";
import ProductValueCard from "@/components/product/product-detail/ProductValueCard";

const ProductBasicInformation: React.FC<ProductBasicInformationProps> = ({ product }) => {
  const productTypeVal = product.productType || product.polymerType?.name || "";
  const chemFamilyVal = product.chemicalFamily?.name || "";
  const physFormVal = product.physicalForm?.name || "";

  const hasContent = productTypeVal || product.tradeName || product.chemicalName ||
    chemFamilyVal || physFormVal || product.color;
  if (!hasContent) return null;
  return (
  <div className="mb-8">
    <h3 className="text-base font-semibold text-gray-700 mb-4">Basic Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProductValueCard label="Product Type" value={productTypeVal} />
      <ProductValueCard label="Trade Name" value={product.tradeName || ""} />
      <ProductValueCard label="Chemical Name" value={product.chemicalName || ""} />
      <ProductValueCard label="Chemical Family" value={chemFamilyVal} />
      <ProductValueCard label="Physical Form" value={physFormVal} />
      <ProductValueCard label="Color" value={product.color || ""} />
    </div>
  </div>
  );
};

export default ProductBasicInformation;

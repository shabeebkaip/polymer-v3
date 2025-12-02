import React from "react";
import { ProductBasicInformationProps } from "@/types/product";
import ProductValueCard from "@/components/product/product-detail/ProductValueCard";

const ProductBasicInformation: React.FC<ProductBasicInformationProps> = ({ product }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {product.productType || product.polymerType ? (
        <ProductValueCard
          label={"Product Type"}
          value={product.productType || product.polymerType?.name || ""}
        />
      ) : null}
      {product.tradeName ? (
        <ProductValueCard label={"Trade Name"} value={product.tradeName || ""} />
      ) : null}
      {product.chemicalName ? (
        <ProductValueCard label={"Chemical Name"} value={product.chemicalName || ""} />
      ) : null}
      {product.chemicalFamily ? (
        <ProductValueCard label={"Chemical Family"} value={product.chemicalFamily?.name || ""} />
      ) : null}
      {product.physicalForm ? (
        <ProductValueCard label={"Physical Form"} value={product.physicalForm?.name || ""} />
      ) : null}
      {product.color ? (
        <ProductValueCard label={"Color"} value={product.color || ""} />
      ) : null}
    </div>
  </div>
);

export default ProductBasicInformation;

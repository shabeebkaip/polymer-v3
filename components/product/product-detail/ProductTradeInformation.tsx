import { ProductTradeInformationProps } from "@/types/product";
import ProductValueCard from "@/components/product/product-detail/ProductValueCard";
import { Badge } from "@/components/ui/badge";
import React from "react";

const ProductTradeInformation: React.FC<ProductTradeInformationProps> = ({ product }) => {
  const paymentTermsVal = product.paymentTerms?.name || "";
  const incotermsVal = product.incoterms?.filter(t => t.name).map(t => t.name).join(", ") || "";
  const packagingTypeVal = product.packagingType?.filter(t => t.name).map(t => t.name).join(", ") || "";

  const hasPricingTerms =
    (product.price && product.price > 0) ||
    (product.minimum_order_quantity && product.minimum_order_quantity > 0) ||
    (product.minOrderQuantity && (product.minOrderQuantity as number) > 0) ||
    paymentTermsVal || product.leadTime || incotermsVal;

  const hasPackaging =
    packagingTypeVal || product.packagingWeight || product.storageConditions || product.shelfLife;

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
      <div className="p-6 lg:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Trade Information</h2>
        {/* Pricing & Terms */}
        {hasPricingTerms ? (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Terms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.price && product.price > 0 ? (
              <ProductValueCard
                label="Price"
                value={`$${product.price}/${product.uom}${product.priceTerms ? ` (${product.priceTerms})` : ""}`}
              />
            ) : null}
            {(product.minimum_order_quantity && product.minimum_order_quantity > 0) ||
            ((product.minOrderQuantity as number) > 0) ? (
              <ProductValueCard
                label="Minimum Order Quantity"
                value={`${product.minimum_order_quantity || product.minOrderQuantity} ${product.uom || ""}`}
              />
            ) : null}
            <ProductValueCard label="Payment Terms" value={paymentTermsVal} />
            <ProductValueCard label="Lead Time" value={product.leadTime || ""} />
            <ProductValueCard label="Incoterms" value={incotermsVal} />
          </div>
        </div>
        ) : null}
        {/* Packaging & Storage */}
        {hasPackaging ? (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Packaging & Storage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProductValueCard label="Packaging Type" value={packagingTypeVal} />
            <ProductValueCard label="Packaging Weight" value={product.packagingWeight || ""} />
            <ProductValueCard label="Storage Conditions" value={product.storageConditions || ""} />
            <ProductValueCard label="Shelf Life" value={product.shelfLife || ""} />
          </div>
        </div>
        ) : null}
        {/* Industry Applications */}
        {product.industry && product.industry.length > 0 ? (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry Applications</h3>
            <div className="flex flex-wrap gap-2">
              {product.industry.map((ind, index) => (
                <Badge
                  key={ind._id || index}
                  variant="outline"
                  className="text-blue-600 border-blue-600"
                >
                  {ind.name}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}
        {/* Product Families */}
        {product.product_family && product.product_family.length > 0 ? (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Families</h3>
            <div className="flex flex-wrap gap-2">
              {product.product_family.map((family, index) => (
                <Badge
                  key={family._id || index}
                  variant="outline"
                  className="text-purple-600 border-purple-600"
                >
                  {family.name}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}
        {/* Grades */}
        {product.grade && product.grade.length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Grades</h3>
            <div className="flex flex-wrap gap-2">
              {product.grade.map((g, index) => (
                <Badge
                  key={g._id || index}
                  variant="outline"
                  className="text-primary-600 border-primary-600"
                >
                  {g.name}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductTradeInformation;
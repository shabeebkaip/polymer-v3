import { Product } from "@/types/product";
import ProductValueCard from "@/components/product/product-detail/ProductValueCard";
import { Badge } from "@/components/ui/badge";
import React from "react";

interface ProductTradeInformationProps {
  product: Product;
}

const ProductTradeInformation: React.FC<ProductTradeInformationProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
      <div className="p-6 lg:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Trade Information</h2>
        {/* Pricing & Terms */}
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
            (product.minOrderQuantity && product.minOrderQuantity > 0) ? (
              <ProductValueCard
                label="Minimum Order Quantity"
                value={`${product.minimum_order_quantity || product.minOrderQuantity} ${product.uom}`}
              />
            ) : null}
            {product.paymentTerms ? (
              <ProductValueCard label="Payment Terms" value={product.paymentTerms.name || ""} />
            ) : null}
            {product.leadTime ? (
              <ProductValueCard label="Lead Time" value={product.leadTime || ""} />
            ) : null}
            {product.incoterms && product.incoterms.length > 0 ? (
              <ProductValueCard
                label="Incoterms"
                value={product.incoterms.map((term) => term.name).join(", ")}
              />
            ) : null}
          </div>
        </div>
        {/* Packaging & Storage */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Packaging & Storage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.packagingType && product.packagingType.length > 0 ? (
              <ProductValueCard
                label="Packaging Type"
                value={product.packagingType.map((type) => type.name).join(", ")}
              />
            ) : null}
            {product.packagingWeight ? (
              <ProductValueCard label="Packaging Weight" value={product.packagingWeight || ""} />
            ) : null}
            {product.storageConditions ? (
              <ProductValueCard label="Storage Conditions" value={product.storageConditions || ""} />
            ) : null}
            {product.shelfLife ? (
              <ProductValueCard label="Shelf Life" value={product.shelfLife || ""} />
            ) : null}
          </div>
        </div>
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
                  className="text-green-600 border-green-600"
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
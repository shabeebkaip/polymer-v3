import React from "react";
import { Badge } from "@/components/ui/badge";
import { Product, ProductSummaryBarProps } from "@/types/product";

const ProductSummaryBar: React.FC<ProductSummaryBarProps> = ({ product }) => {
  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-primary-600 border-primary-600"
            >
              {product.productType || product.polymerType?.name || "Product"}
            </Badge>
            <span className="text-gray-600">•</span>
            <span className="font-medium">{product.productName}</span>
          </div>
          {product.grade || product.physicalForm ? (
            <>
              <span className="text-gray-600">•</span>
              <span className="text-gray-700">
                {product.grade &&
                Array.isArray(product.grade) &&
                product.grade.length > 0 ? (
                  <>
                    Grade:{" "}
                    <span className="font-medium">
                      {product.grade.map((g, index) => (
                        <span key={g._id || index}>
                          {g.name}
                          {index < product.grade!.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </span>
                  </>
                ) : null}
                {product.physicalForm && !product.grade ? (
                  <>
                    Form:{" "}
                    <span className="font-medium">
                      {product.physicalForm?.name}
                    </span>
                  </>
                ) : null}
              </span>
            </>
          ) : null}
          {((product.minimum_order_quantity &&
              product.minimum_order_quantity > 0) ||
            (product.minOrderQuantity && product.minOrderQuantity > 0)) &&
          product.uom ? (
            <>
              <span className="text-gray-600">•</span>
              <span className="text-gray-700">
                Min Order:{" "}
                <span className="font-medium">
                  {product.minimum_order_quantity || product.minOrderQuantity}{" "}
                  {product.uom}
                </span>
              </span>
            </>
          ) : null}
          {product.createdBy ? (
            <>
              <span className="text-gray-600">•</span>
              <span className="text-gray-700">
                By:{" "}
                <span className="font-medium">{product.createdBy.company}</span>
              </span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProductSummaryBar;
import React from "react";
import { Product, ProductOverviewProps } from "@/types/product";

const ProductOverview: React.FC<ProductOverviewProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
      <div className="p-6 lg:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Product Overview</h2>

        {product.description ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        ) : null}

        {product.additionalInfo && product.additionalInfo.length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.additionalInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border-l-4 border-blue-500 shadow-sm"
                >
                  <h4 className="font-bold text-blue-900 mb-3 text-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    {info.title}
                  </h4>
                  <p className="text-blue-800 leading-relaxed">
                    {info.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductOverview;

import React from "react";
import { useRouter } from "next/navigation";
import QuoteRequestModal from "../shared/QuoteRequestModal";
import SampleRequestModal from "../shared/SampleRequestModal";
import { ProductCardTypes } from "@/types/product";
import { FALLBACK_PRODUCT_IMAGE, FALLBACK_COMPANY_IMAGE } from "@/lib/fallbackImages";

// Define a proper type for product props

interface ProductCardProps {
  product: ProductCardTypes;
  userType?: string; // Optional prop for user type
}

const ProductCard: React.FC<ProductCardProps> = ({ product, userType }) => {
  const router = useRouter();
  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-emerald-200 h-full flex flex-col">
      <div className="relative overflow-hidden">
        {/* Product image */}
        <div className="aspect-w-16 aspect-h-10 bg-gray-100 relative">
          <img
            src={product?.productImages?.[0]?.fileUrl || FALLBACK_PRODUCT_IMAGE}
            alt={product?.productName || 'Product'}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
        </div>
        
        {/* Hover overlay with company logo */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <img
            src={product?.createdBy?.company_logo || FALLBACK_COMPANY_IMAGE}
            alt="Company"
            className="w-8 h-8 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_COMPANY_IMAGE;
            }}
          />
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Company Info Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0">
            <img
              src={product?.createdBy?.company_logo || FALLBACK_COMPANY_IMAGE}
              alt="Company"
              className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_COMPANY_IMAGE;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-lg text-gray-900 truncate group-hover:text-emerald-700 transition-colors duration-200">
              {product?.productName || 'Untitled Product'}
            </h4>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {product?.countryOfOrigin || 'Unknown'}
            </p>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-3 mb-6 flex-1">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">Chemical Name:</span>
                <span className="text-gray-900 text-right max-w-[60%] leading-relaxed">
                  {product.chemicalName || 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">Polymer Type:</span>
                <span className="text-gray-900 text-right max-w-[60%] leading-relaxed">
                  {product.polymerType?.name || 'Not specified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {userType === "buyer" && (
            <div className="grid grid-cols-2 gap-2">
              <QuoteRequestModal
                className="px-3 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 cursor-pointer text-sm font-medium text-center shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                productId={product?._id}
                uom={product?.uom}
              />
              <SampleRequestModal
                className="px-3 py-2.5 border-2 border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-300 cursor-pointer text-sm font-medium text-center hover:border-emerald-600 transform hover:scale-[1.02]"
                productId={product?._id}
                uom={product?.uom}
              />
            </div>
          )}
          <button
            className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 text-sm font-medium transform hover:scale-[1.02] shadow-sm hover:shadow-md"
            onClick={() => {
              router.push(`/products/${product._id}`);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

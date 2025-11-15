import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import QuoteRequestModal from "../shared/QuoteRequestModal";
import SampleRequestModal from "../shared/SampleRequestModal";
import { ProductCardTypes, ProductCardProps } from "@/types/product";
import { FALLBACK_PRODUCT_IMAGE, FALLBACK_COMPANY_IMAGE } from "@/lib/fallbackImages";

const ProductCard: React.FC<ProductCardProps> = ({ product, userType }) => {
  const router = useRouter();
  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-500/30 h-full flex flex-col">
      <div className="relative overflow-hidden">
        {/* Product image */}
        <div className="aspect-w-16 aspect-h-10 bg-gray-100 relative">
          <Image
            src={product?.productImages?.[0]?.fileUrl || FALLBACK_PRODUCT_IMAGE}
            alt={product?.productName || 'Product'}
            width={320}
            height={160}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
        </div>
        
        {/* Hover overlay with company logo */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Image
            src={product?.createdBy?.company_logo || FALLBACK_COMPANY_IMAGE}
            alt="Company"
            width={24}
            height={24}
            className="w-6 h-6 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_COMPANY_IMAGE;
            }}
          />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        {/* Company Info Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-shrink-0">
            <Image
              src={product?.createdBy?.company_logo || FALLBACK_COMPANY_IMAGE}
              alt="Company"
              width={40}
              height={40}
              className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_COMPANY_IMAGE;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base text-gray-900 truncate group-hover:text-primary-600 transition-colors duration-200">
              {product?.productName || 'Untitled Product'}
            </h4>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {product?.countryOfOrigin || 'Unknown'}
            </p>
          </div>
        </div>

        {/* Product Details */}
        <div className="mb-4 flex-1">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-3 border border-gray-200/50">
            <div className="space-y-2">
              <div>
                <span className="text-gray-600 font-medium text-xs uppercase tracking-wide">Chemical Name</span>
                <div className="text-gray-900 text-sm font-medium leading-snug break-words mt-1">
                  {product.chemicalName || 'Not specified'}
                </div>
              </div>
              <div className="border-t border-gray-200/60 pt-2">
                <span className="text-gray-600 font-medium text-xs uppercase tracking-wide">Polymer Type</span>
                <div className="text-gray-900 text-sm font-medium leading-snug break-words mt-1">
                  {product.polymerType?.name || 'Not specified'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {userType === "buyer" && (
            <div className="grid grid-cols-2 gap-2">
              <QuoteRequestModal
                className="px-2 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-all duration-300 cursor-pointer text-xs font-medium text-center"
                productId={product?._id}
                uom={product?.uom}
              />
              <SampleRequestModal
                className="px-2 py-1.5 border border-primary-500 text-primary-600 rounded-md hover:bg-primary-50 transition-all duration-300 cursor-pointer text-xs font-medium text-center hover:border-primary-600"
                productId={product?._id}
                uom={product?.uom}
              />
            </div>
          )}
          <button
            className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300 text-xs font-medium"
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

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Delete, Pencil } from "lucide-react";
import { FALLBACK_PRODUCT_IMAGE, FALLBACK_COMPANY_IMAGE } from "@/lib/fallbackImages";

interface Product {
  [key: string]: any;
}

interface UserProductCardProps {
  product: Product;
}

const UserProductCard: React.FC<UserProductCardProps> = ({ product }) => {
  const router = useRouter();
  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/50 hover:border-green-300/50 h-full flex flex-col">
      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={product?.productImages?.[0]?.fileUrl || FALLBACK_PRODUCT_IMAGE}
            alt="Product"
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            <img
              src={product?.createdBy?.company_logo || FALLBACK_COMPANY_IMAGE}
              className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_COMPANY_IMAGE;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base text-gray-900 truncate group-hover:text-green-700 transition-colors duration-200">
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

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <Button
            variant={"secondary"}
            color="green"
            className="cursor-pointer px-3 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 text-sm font-medium shadow-lg"
            onClick={() => {
              router.push(`/user/products/${product._id}`);
            }}
          >
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </Button>

          <Button 
            variant={"destructive"} 
            className="cursor-pointer px-3 py-2.5 bg-red-50 border border-red-300 text-red-700 rounded-xl hover:bg-red-100 hover:border-red-400 hover:text-red-800 transition-all duration-300 text-sm font-medium"
          >
            <Delete className="w-4 h-4 mr-2" /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProductCard;

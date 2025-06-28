import React from "react";
import { Skeleton } from "../ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 h-full flex flex-col">
      {/* Product image skeleton */}
      <div className="relative">
        <Skeleton className="w-full h-40 rounded-none" />
      </div>

      <div className="p-4 flex flex-col flex-1">
        {/* Company Info Header skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="w-3/4 h-4 mb-1" />
            <Skeleton className="w-1/2 h-3" />
          </div>
        </div>

        {/* Product Details skeleton */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4 flex-1">
          <div className="space-y-2">
            <div>
              <Skeleton className="w-20 h-3 mb-1" />
              <Skeleton className="w-full h-4" />
            </div>
            <div className="border-t border-gray-200/60 pt-2">
              <Skeleton className="w-24 h-3 mb-1" />
              <Skeleton className="w-2/3 h-4" />
            </div>
          </div>
        </div>

        {/* Action Buttons skeleton */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="w-full h-7 rounded-md" />
            <Skeleton className="w-full h-7 rounded-md" />
          </div>
          <Skeleton className="w-full h-8 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;

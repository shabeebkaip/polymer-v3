import React from "react";
import { Skeleton } from "../ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 h-full flex flex-col">
      {/* Product image skeleton */}
      <div className="relative">
        <Skeleton className="w-full h-48 rounded-none" />
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Company Info Header skeleton */}
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="w-3/4 h-5 mb-2" />
            <Skeleton className="w-1/2 h-4" />
          </div>
        </div>

        {/* Product Details skeleton */}
        <div className="bg-gray-50 rounded-lg p-3 mb-6 flex-1">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-20 h-4" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="w-28 h-4" />
              <Skeleton className="w-16 h-4" />
            </div>
          </div>
        </div>

        {/* Action Buttons skeleton */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="w-full h-10 rounded-lg" />
            <Skeleton className="w-full h-10 rounded-lg" />
          </div>
          <Skeleton className="w-full h-12 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;

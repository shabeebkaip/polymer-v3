import React from "react";
import { Skeleton } from "../ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="rounded-xl p-2 shadow-lg  transition-shadow duration-300 h-full flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        {/* Product image skeleton */}
        <Skeleton className="w-full h-32  rounded-md mb-4" />

        {/* Seller Info skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="w-20 h-20 rounded-md" />
          <div className="flex flex-col justify-center">
            <Skeleton className="w-32 h-6 mb-2" />
            <Skeleton className="w-24 h-4" />
          </div>
        </div>
        <hr className="h-px bg-gray-200 border-0" />

        {/* Product Info skeleton */}
        <div className="flex flex-col gap-2 text-sm ">
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4" />
        </div>
        {/* CTA Buttons skeleton */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Skeleton className="w-full h-10 rounded-lg" />
          <Skeleton className="w-full h-10 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;

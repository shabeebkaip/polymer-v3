import React from "react";
import Image from "next/image";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/fallbackImages";
import { ProductHome } from "@/types/home";



const ProductCard: React.FC<{ product: ProductHome }> = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between w-full min-h-[400px] max-w-full">
      <div className="w-full h-[200px] flex justify-center items-center mb-4">
        <Image
          src={product.productImages?.[0]?.fileUrl || FALLBACK_PRODUCT_IMAGE}
          alt={product.productName}
          width={180}
          height={180}
          className="object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_PRODUCT_IMAGE;
          }}
        />
      </div>
      <h2 className="text-lg font-semibold line-clamp-2 mb-2">{product.productName}</h2>
      <p className="text-sm text-gray-600 flex-grow line-clamp-3">
        {product.description}
      </p>
      <div className="mt-4 text-primary-600 font-medium">
        {product.price} / {product.uom}
      </div>
    </div>
  );
};

export default ProductCard;

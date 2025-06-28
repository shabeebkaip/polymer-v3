"use client";
import React from "react";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "../shared/ProductCardSkeleton";
import { ProductCardTypes } from "@/types/product";


interface ProductsListProps {
  products: ProductCardTypes[];
  loader?: boolean;
  userType?: string;
}

// --- Component ---
const ProductsList: React.FC<ProductsListProps> = ({
  products,
  loader,
  userType,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {loader
        ? Array.from({ length: 9 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))
        : products.map((product, index) => (
          <ProductCard key={index} product={product} userType={userType} />
        ))}
    </div>
  );
};

export default ProductsList;

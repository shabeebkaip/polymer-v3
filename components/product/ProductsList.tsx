"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";

const ProductsList: React.FC = () => {
  const searchParams = useSearchParams();
  const supplierDetail = searchParams.get("supplierDetail");

  console.log("Query param supplierDetail =", supplierDetail);

  const products = [
    { image: "/assets/house_big.png", logo: "/assets/seller 1.svg" },
    { image: "/assets/house_big (1).png", logo: "/assets/seller 2.svg" },
    { image: "/assets/house_big (2).png", logo: "/assets/seller 3.svg" },
    { image: "/assets/house_big (3).png", logo: "/assets/seller 2.svg" },
    { image: "/assets/house_big (1).png", logo: "/assets/seller 2.svg" },
    { image: "/assets/house_big (2).png", logo: "/assets/seller 3.svg" },
    { image: "/assets/house_big (3).png", logo: "/assets/seller 2.svg" },
    { image: "/assets/house_big.png", logo: "/assets/seller 1.svg" },
    { image: "/assets/house_big (1).png", logo: "/assets/seller 2.svg" },
    { image: "/assets/house_big (2).png", logo: "/assets/seller 3.svg" },
    { image: "/assets/house_big (3).png", logo: "/assets/seller 2.svg" },
  ];

  // Optionally filter products using supplierDetail logic
  // Example: if (supplierDetail) { ...filter logic here }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;

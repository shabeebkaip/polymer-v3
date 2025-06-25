"use client";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const ProductsClient = dynamic(() => import("@/components/product/ProductsClient"))
  

// --- Component ---
const ProductsPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsClient />
    </Suspense>
  );
};

export default ProductsPage;

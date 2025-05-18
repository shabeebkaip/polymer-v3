"use client";

import React, { Suspense } from "react";
import ProductsClient from "@/components/product/ProductsClient";

// --- Component ---
const ProductsPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsClient />
    </Suspense>
  );
};

export default ProductsPage;

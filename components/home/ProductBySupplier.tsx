"use client";
import { useSharedState } from "@/stores/sharedStore";
import React, { useEffect } from "react";
import ProductsByBrand from "./ProductsByBrand";

const ProductBySupplier = () => {
  const { sellers,  fetchSellers } = useSharedState();

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  return <ProductsByBrand sellers={sellers} />;
};

export default ProductBySupplier;

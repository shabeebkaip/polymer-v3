"use client";
import React from "react";
import ProductCard from "@/components/product/ProductCard";

// --- Types ---
interface Product {
  _id: string;
  name: string;
  [key: string]: any;
}

interface ProductsListProps {
  products: Product[];
}

// --- Component ---
const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
  console.log("ProductsList", products);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;

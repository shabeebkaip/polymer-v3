"use client";
import React, { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SupplierBasic from "@/components/suppliers/SupplierBasic";
import { getProductFilters, getProductList } from "@/apiServices/products";

// --- Types ---
interface ProductFilter {
  name: string;
  displayName: string;
  component: string;
  data: Array<any>; // Can replace `any` with a proper data shape later
}

interface Product {
  _id: string;
  name: string;
  [key: string]: any;
}

interface Pagination {
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

// --- Dynamic Imports ---
const Filter = dynamic(() => import("@/components/product/Filter"));
const SearchBar = dynamic(() => import("@/components/product/SearchBar"));
const ProductsList = dynamic(() => import("@/components/product/ProductsList"));

// --- Component ---
const ProductsPage: React.FC = () => {
  const [query, setQuery] = useState<Record<string, any>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<ProductFilter[]>([]);

  useEffect(() => {
    getProductList(query).then((response) => {
      setProducts(response.data);
      setPagination(response.pagination);
    });

    getProductFilters().then((response) => {
      setFilters(response.filter);
    });
  }, [query]);

  return (
    <section className="mt-10 container mx-auto px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SupplierBasic />
      </Suspense>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10">
        <div className="hidden md:block md:col-span-3">
          <Suspense fallback={<div>Loading filters...</div>}>
            <Filter
              filters={filters}
              onFilterChange={(selectedOption: string) => {
                console.log("Selected filter option:", selectedOption);
              }}
            />
          </Suspense>
        </div>
        <div className="col-span-9">
          <SearchBar />
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductsList products={products} />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;

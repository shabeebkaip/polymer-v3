"use client";

import React, { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import SupplierBasic from "@/components/suppliers/SupplierBasic";
import { getProductFilters, getProductList } from "@/apiServices/products";
import { set } from "date-fns";

// --- Types ---
interface ProductFilter {
  name: string;
  displayName: string;
  component: string;
  data: Array<any>;
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
  const searchParams = useSearchParams();

  // --- Extract initial filter parameters ---
  const initialIndustry = searchParams.get("industry");
  const initialProductFamily = searchParams.get("productFamily");
  const initialCreatedBy = searchParams.get("createdBy");

  // --- Construct initial query object ---
  const initialQuery: Record<string, any> = {};
  if (initialCreatedBy) initialQuery.createdBy = [initialCreatedBy];
  if (initialIndustry) initialQuery.industry = [initialIndustry];
  if (initialProductFamily) initialQuery.productFamily = [initialProductFamily];

  const [query, setQuery] = useState<Record<string, any>>(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<ProductFilter[]>([]);

  // --- Fetch filters only once ---
  useEffect(() => {
    getProductFilters().then((response) => {
      setFilters(response.filter);
    });
  }, []);

  // --- Fetch products on query change ---
  useEffect(() => {
    getProductList(query).then((response) => {
      setProducts(response.data);
      setPagination(response.pagination);
    });
  }, [query]);

  const handleFilter = (name: string, id: string, isChecked: boolean) => {
    setQuery((prev) => {
      const existing = prev[name] || [];

      if (isChecked) {
        // Add the ID if not already present
        return {
          ...prev,
          [name]: existing.includes(id) ? existing : [...existing, id],
        };
      } else {
        // Remove the ID; delete the key if the array becomes empty
        const updated = existing.filter((val: string) => val !== id);
        const newQuery = { ...prev, [name]: updated };

        if (updated.length === 0) {
          delete newQuery[name];
        }

        return newQuery;
      }
    });
  };

  return (
    <section className="mt-10 container mx-auto px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SupplierBasic />
      </Suspense>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10">
        <div className="hidden md:block md:col-span-3">
          <Suspense fallback={<div>Loading filters...</div>}>
            <Filter filters={filters} onFilterChange={handleFilter} />
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

"use client";

import React, { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import SupplierBasic from "@/components/suppliers/SupplierBasic";
import { getProductFilters, getProductList } from "@/apiServices/products";
import FilterModal from "./FilterModal";
import { useUserInfo } from "@/lib/useUserInfo";
import { ProductCardTypes } from "@/types/product";

// --- Types ---
interface ProductFilter {
  name: string;
  displayName: string;
  component: string;
  data: Array<any>;
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
const ProductsClient: React.FC = () => {
  const { user } = useUserInfo();
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
  const [products, setProducts] = useState<ProductCardTypes[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<ProductFilter[]>([]);
  const [loader, setLoader] = useState(true);
  const [filterLoader, setFilterLoader] = useState(true);

  // --- Fetch filters only once ---
  useEffect(() => {
    setFilterLoader(true); // Start loading state for filters
    getProductFilters().then((response) => {
      setFilters(response.filter);
      setFilterLoader(false); // End loading state for filters
    });
  }, []);

  // --- Fetch products on query change ---
  useEffect(() => {
    setLoader(true); // Start loading state
    getProductList(query).then((response) => {
      setProducts(response.data);
      setPagination(response.pagination);
      setLoader(false); // End loading state
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
            <Filter
              filters={filters}
              onFilterChange={handleFilter}
              query={query}
            />
          </Suspense>
        </div>

        <div className="col-span-1 md:col-span-9">
          <div className="flex items-center gap-5">
            <div className="flex items-center md:hidden">
              <button
                className="py-2 px-4 bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white rounded shadow font-semibold"
                onClick={() => setMobileFilterOpen(true)}
              >
                Filter
              </button>
            </div>
            <SearchBar
              onSearch={(value) => setQuery({ ...query, search: value })}
              query={query}
            />
          </div>
          <FilterModal
            open={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
          >
            <Suspense fallback={<div>Loading filters...</div>}>
              <Filter
                filters={filters}
                onFilterChange={(name, id, isChecked) => {
                  handleFilter(name, id, isChecked);
                }}
                query={query}
              />
            </Suspense>
          </FilterModal>

          <Suspense fallback={<div>Loading products...</div>}>
            <ProductsList
              products={products}
              loader={loader}
              userType={user?.user_type}
            />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default ProductsClient;

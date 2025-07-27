"use client";

import React, { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import SupplierBasic from "@/components/suppliers/SupplierBasic";
import { getProductFilters, getProductList } from "@/apiServices/products";
import FilterModal from "./FilterModal";
import { useUserInfo } from "@/lib/useUserInfo";
import { useInfiniteScroll } from "@/lib/useInfiniteScroll";
import BackToTop from "@/components/shared/BackToTop";
import { ProductCardTypes } from "@/types/product";

// --- Types ---
interface FilterDataItem {
  _id: string | boolean;
  name: string;
  count: number;
}

interface FilterSection {
  name: string;
  displayName: string;
  component: string;
  filterType: string;
  collapsible: boolean;
  searchable?: boolean;
  data: FilterDataItem[];
}

interface ProductFilter {
  filterSide: FilterSection[];
  filterTop: FilterSection[];
}



interface Pagination {
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

// --- Dynamic Imports ---
import Filter from "@/components/product/Filter";
import FilterTop from "@/components/product/FilterTop";
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
  const initialQuery: Record<string, string[] | string> = {};
  if (initialCreatedBy) initialQuery.createdBy = [initialCreatedBy];
  if (initialIndustry) initialQuery.industry = [initialIndustry];
  if (initialProductFamily) initialQuery.productFamily = [initialProductFamily];

  const [query, setQuery] = useState<Record<string, string[] | string>>(initialQuery);
  const [products, setProducts] = useState<ProductCardTypes[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<ProductFilter>();
  const [loader, setLoader] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // --- Fetch filters only once ---
  useEffect(() => {
    setLoader(true); // Start loading state for filters
    getProductFilters().then((response) => {
      setFilters(response);
      // Don't set loader to false here since products still need to load
    });
  }, []);

  // --- Fetch products on query change ---
  useEffect(() => {
    setLoader(true); // Start loading state
    setProducts([]); // Clear existing products when query changes
    setHasMore(true); // Reset hasMore flag
    getProductList({ ...query, page: 1 }).then((response) => {
      setProducts(response.data || []);
      setPagination(response.pagination || null);
      setHasMore(response.pagination ? response.pagination.page < response.pagination.totalPages : false);
      setLoader(false); // End loading state
    }).catch((error) => {
      console.error('Error fetching products:', error);
      setProducts([]);
      setPagination(null);
      setHasMore(false);
      setLoader(false);
    });
  }, [query]);

  // --- Load more products ---
  const loadMoreProducts = async () => {
    if (!pagination || loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = pagination.page + 1;
      const response = await getProductList({ ...query, page: nextPage });
      
      setProducts(prev => [...prev, ...(response.data || [])]);
      setPagination(response.pagination || null);
      setHasMore(response.pagination ? response.pagination.page < response.pagination.totalPages : false);
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // --- Infinite scroll hook ---
  useInfiniteScroll({
    hasMore,
    loading: loadingMore || loader,
    onLoadMore: loadMoreProducts,
    threshold: 200
  });

  const handleFilter = (name: string, id: string, isChecked: boolean) => {
    setQuery((prev) => {
      const existing = prev[name];
      const existingArray = Array.isArray(existing) ? existing : [];

      if (isChecked) {
        // Add the ID if not already present
        return {
          ...prev,
          [name]: existingArray.includes(id) ? existingArray : [...existingArray, id],
        };
      } else {
        // Remove the ID; delete the key if the array becomes empty
        const updated = existingArray.filter((val: string) => val !== id);
        const newQuery = { ...prev, [name]: updated };

        if (updated.length === 0) {
          delete newQuery[name];
        }

        return newQuery;
      }
    });
  };

  console.log("filters", filters);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
      {/* Header Section with Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Suspense fallback={
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            </div>
          }>
            <SupplierBasic />
          </Suspense>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-6 space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden">
                <div className="p-6 border-b border-gray-100/50 bg-gradient-to-r from-emerald-50/80 to-green-50/80">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-lg font-bold">Filters</div>
                      <div className="text-xs text-gray-600 font-normal">Refine your search</div>
                    </div>
                  </h2>
                </div>
                <div className="p-6">
                  <Suspense fallback={
                    <div className="space-y-6">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-3"></div>
                          <div className="space-y-3">
                            <div className="h-10 bg-gray-100 rounded-xl"></div>
                            <div className="h-10 bg-gray-100 rounded-xl"></div>
                            <div className="h-8 bg-gray-50 rounded-lg"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  }>
                    <Filter
                      filters={filters?.filterSide || []}
                      onFilterChange={handleFilter}
                      query={query}
                    />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-1 lg:col-span-9">
            {/* Search and Mobile Filter Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Mobile Filter Button */}
                <div className="lg:hidden">
                  <button
                    className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                    onClick={() => setMobileFilterOpen(true)}
                  >
                    <div className="p-1 bg-white/20 rounded-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </div>
                    <span>Filters</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="flex-1 w-full">
                  <SearchBar
                    onSearch={(value) => setQuery({ ...query, search: value })}
                    query={query}
                  />
                </div>
              </div>
            </div>
            
            {/* Top Filters as Dropdowns */}
            {filters?.filterTop && filters.filterTop.length > 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Quick Filters</h3>
                    <p className="text-sm text-gray-500">Select multiple options to narrow down results</p>
                  </div>
                </div>
                <FilterTop
                  filters={filters.filterTop}
                  onFilterChange={handleFilter}
                  query={query}
                />
                {/* Filter Summary & Clear Button */}
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                  {Object.entries(query)
                    .filter(([, value]) => value && (Array.isArray(value) ? value.length > 0 : value !== ""))
                    .map(([key, value]) => {
                      const filterSection = filters.filterTop.find(f => f.name === key) || filters.filterSide.find(f => f.name === key);
                      // If filterSection found, map value(s) to displayName
                      if (filterSection) {
                        const getDisplayName = (id: string | boolean) => {
                          const item = filterSection.data.find(d => d._id === id);
                          return item ? item.name : id;
                        };
                        if (Array.isArray(value)) {
                          return (
                            <span key={`${key}-${value.join(',')}`} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                              {filterSection.displayName || key}: {value.map(v => getDisplayName(v)).join(", ")}
                            </span>
                          );
                        } else {
                          return (
                            <span key={`${key}-${value}`} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                              {filterSection.displayName || key}: {getDisplayName(value)}
                            </span>
                          );
                        }
                      }
                      // fallback: just show raw value
                      return (
                        <span key={`${key}-raw`} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                          {key}: {Array.isArray(value) ? value.join(", ") : value}
                        </span>
                      );
                    })}
                  {Object.keys(query).length > 0 && (
                    <button
                      onClick={() => setQuery({})}
                      className="ml-2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full text-xs font-semibold shadow hover:from-emerald-600 hover:to-green-700 transition-all duration-200"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Products Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden">
              <div className="p-6 border-b border-gray-100/50 bg-gradient-to-r from-blue-50/80 to-indigo-50/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4v-6.586a1 1 0 00-.293-.707L4 11m16 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Products</h2>
                      <p className="text-sm text-gray-600">Discover quality polymer products</p>
                    </div>
                  </div>
                  {!loader && products.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                        {products.length} of {pagination?.totalItems || products.length} products
                      </span>
                      {pagination && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
                          Page {pagination.page} of {pagination.totalPages}
                        </span>
                      )}
                      {pagination && pagination.totalItems && pagination.totalItems > 0 && (
                        <div className="hidden sm:flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                              style={{ width: `${(products.length / pagination.totalItems) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {Math.round((products.length / pagination.totalItems) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <Suspense fallback={
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-56 rounded-xl mb-4"></div>
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
                          <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                }>
                  <ProductsList
                    products={products}
                    loader={loader}
                    userType={user?.user_type}
                  />
                </Suspense>

                {/* Load More Products */}
                {!loader && products.length > 0 && hasMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={loadMoreProducts}
                      disabled={loadingMore}
                      className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loadingMore ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Loading more products...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Load More Products</span>
                          <div className="bg-white/20 px-2 py-1 rounded-full text-xs">
                            {pagination && pagination.totalItems ? pagination.totalItems - products.length : 0} more
                          </div>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Loading More Skeleton */}
                {loadingMore && (
                  <div className="mt-8">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 rounded-xl text-emerald-700">
                        <div className="w-5 h-5 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin"></div>
                        <span className="font-medium">Loading more products...</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-56 rounded-xl mb-4"></div>
                          <div className="space-y-3">
                            <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
                            <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* End of Results */}
                {!loader && products.length > 0 && !hasMore && (
                  <div className="text-center mt-8 py-6">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-xl text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">You&apos;ve seen all {pagination?.totalItems || products.length} products!</span>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!loader && products.length === 0 && (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                      We couldn&apos;t find any products matching your criteria. Try adjusting your filters or search terms.
                    </p>
                    <button
                      onClick={() => {
                        setQuery({});
                        setProducts([]);
                        setHasMore(true);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        <FilterModal
          open={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Filter Products</h2>
                <p className="text-sm text-gray-600">Refine your search results</p>
              </div>
            </div>
            <Suspense fallback={
              <div className="space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-3"></div>
                    <div className="space-y-3">
                      <div className="h-10 bg-gray-100 rounded-xl"></div>
                      <div className="h-10 bg-gray-100 rounded-xl"></div>
                      <div className="h-8 bg-gray-50 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            }>
              <Filter
                filters={filters?.filterSide || []}
                onFilterChange={(name: string, id: string, isChecked: boolean) => {
                  handleFilter(name, id, isChecked);
                }}
                query={query}
              />
            </Suspense>
          </div>
        </FilterModal>
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default ProductsClient;

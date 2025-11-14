"use client";
import { getProductList } from "@/apiServices/products";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import UserProductCard from "@/components/user/UserProductCard";
import { useUserInfo } from "@/lib/useUserInfo";
import React, { useEffect, useState } from "react";
import { Package, Plus, Search, TrendingUp, BarChart3 } from "lucide-react";
import { Product } from "@/types/product";

const ProductsPage: React.FC = () => {
  const { user } = useUserInfo();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user?._id) return;
      
      try {
        setLoading(true);
        const response = await getProductList({
          createdBy: [user._id as string],
        });
        setProducts(response.data || []);
        setError(null);
      } catch (err) {
        setError("Failed to load your products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.chemicalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.polymerType?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/40">
      <div className="max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl:max-w-7xl mx-auto px-4 py-8">
      {loading ? (
        /* Full Page Loader */
        <div className="space-y-8">
          {/* Header Section Skeleton */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5 rounded-3xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-5">
                  <Skeleton className="w-16 h-16 rounded-2xl" />
                  <div>
                    <Skeleton className="h-10 w-64 mb-3" />
                    <Skeleton className="h-5 w-80" />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-32 rounded-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="w-12 h-12 rounded-xl" />
                </div>
              </div>
            ))}
          </div>

          {/* Search Section Skeleton */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 space-y-4">
                <Skeleton className="w-full h-48 rounded-xl" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-4/5" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Actual Content */
        <>
          {/* Header Section */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5 rounded-3xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
                      <Package className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
                      My Products
                    </h1>
                    <p className="text-gray-600 text-lg mt-2 font-medium">
                      Manage and track your product inventory
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 shadow-lg"
                    onClick={() => {
                      window.location.href = "/user/products/add";
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>
            </div>
          </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium mb-1">Total Products</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {products.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-600 text-sm font-medium mb-1">Active</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {products.filter(p => p.status !== "inactive").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-teal-600 text-sm font-medium mb-1">Categories</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {new Set(products.map(p => p.polymerType?.name).filter(Boolean)).size}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-teal-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lime-600 text-sm font-medium mb-1">This Month</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {products.filter(p => {
                        const productDate = new Date(p.createdAt);
                        const currentDate = new Date();
                        return productDate.getMonth() === currentDate.getMonth() && 
                               productDate.getFullYear() === currentDate.getFullYear();
                      }).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-lime-100 to-green-100 rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-lime-600" />
                  </div>
                </div>
              </div>
            </div>

          {/* Search and Filter Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by product name, chemical, or polymer type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-green-500 rounded-xl text-base"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600 font-medium bg-gray-100 px-4 py-2 rounded-lg">
                  {filteredProducts.length} of {products.length} products
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {error ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Failed to Load Products</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6"
              >
                Try Again
              </Button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchTerm ? "No matching products" : "No products yet"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? "Try adjusting your search criteria to find what you're looking for"
                  : "Start by adding your first product to showcase your inventory and grow your business"
                }
              </p>
              {!searchTerm && (
                <Button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6"
                  onClick={() => {
                    window.location.href = "/user/products/add";
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <div key={product._id || index} className="group">
                  <UserProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default ProductsPage;

"use client";
import { getProductList } from "@/apiServices/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import UserProductCard from "@/components/user/UserProductCard";
import { useUserInfo } from "@/lib/useUserInfo";
import React, { useEffect, useState } from "react";
import { Package, Plus, Search, Filter, Download, TrendingUp, Eye, Edit, BarChart3 } from "lucide-react";

const ProductsPage: React.FC = () => {
  const { user } = useUserInfo();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user?._id) return;
      
      try {
        setLoading(true);
        const response = await getProductList({
          createdBy: [user._id],
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
  console.log("products", products);
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {loading ? (
        /* Full Page Loader */
        <div className="space-y-8">
          {/* Header Section Skeleton */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-28 rounded-md" />
              </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-12" />
                      </div>
                      <Skeleton className="w-10 h-10 rounded-lg" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Search Section Skeleton */}
          <Card className="mb-6 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <Skeleton className="w-full h-32 rounded-xl" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-7 w-full rounded-md" />
                    <Skeleton className="h-7 w-full rounded-md" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        /* Actual Content */
        <>
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
                  <p className="text-gray-600 text-sm">
                    Manage and track your product inventory
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    window.location.href = "/user/products/add";
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-600 text-sm font-medium">Total Products</p>
                      <p className="text-2xl font-bold text-emerald-900">
                        {products.length}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-200 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-emerald-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Active</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {products.filter(p => p.status !== "inactive").length}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Categories</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {new Set(products.map(p => p.polymerType?.name).filter(Boolean)).size}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-purple-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-medium">This Month</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {products.filter(p => {
                          const productDate = new Date(p.createdAt);
                          const currentDate = new Date();
                          return productDate.getMonth() === currentDate.getMonth() && 
                                 productDate.getFullYear() === currentDate.getFullYear();
                        }).length}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
                      <Plus className="w-5 h-5 text-orange-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Search and Filter Section */}
          <Card className="mb-6 border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by product name, chemical, or polymer type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                  />
                </div>
                <div className="text-sm text-gray-500">
                  {filteredProducts.length} of {products.length} products
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          {error ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Products</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : filteredProducts.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? "No matching products" : "No products yet"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? "Try adjusting your search criteria"
                    : "Start by adding your first product to showcase your inventory"
                  }
                </p>
                {!searchTerm && (
                  <Button
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      window.location.href = "/user/products/add";
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Your First Product
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <UserProductCard key={product._id || index} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPage;

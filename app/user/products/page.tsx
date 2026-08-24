"use client";
import { getProductList } from "@/apiServices/products";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import UserProductCard from "@/components/user/UserProductCard";
import QuickAddProduct from "@/components/user/products/QuickAddProduct";
import { useUserInfo } from "@/lib/useUserInfo";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Package, Plus, Search, TrendingUp, BarChart3, Zap } from "lucide-react";
import { Product } from "@/types/product";

const QUICK_ADD_ARRIVAL_GUARD_KEY = "polymer-v3:quickAddArrivalGuard";
// T16 item 4 — survives the Quick Add / Detailed round trip, which unmounts this
// page. Tab-scoped (sessionStorage), same pattern as the quickAdd draft.
const PRODUCTS_SEARCH_KEY = "polymer-v3:productsSearch";

const ProductsPageInner: React.FC = () => {
  const { user } = useUserInfo();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  // ponytail: local-state-only modal per PROJECT_PLAN decision #2 — no URL/history-backed routing
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  // One-shot "open on arrival" trigger — consumed once, then stripped from the
  // URL, so modal state itself stays local (not route-backed). Set by the
  // add/page.tsx "Back to Quick Add" link so it lands here with the modal open
  // instead of the old full-page quick form.
  //
  // ponytail: app/user/layout.tsx mounts {children} twice (desktop + mobile
  // trees, one CSS-hidden per breakpoint) — both copies of this component run
  // this effect, and the Radix Dialog portals to document.body regardless of
  // which copy opened it, so without a cross-instance guard we'd open two
  // stacked dialogs. sessionStorage is the one thing both instances share;
  // the flag is cleared on the next tick once both have had a chance to read
  // it, so it doesn't block a later genuine "Back to Quick Add" arrival.
  useEffect(() => {
    if (searchParams.get("quickAdd") !== "1") return;
    if (sessionStorage.getItem(QUICK_ADD_ARRIVAL_GUARD_KEY)) return;
    sessionStorage.setItem(QUICK_ADD_ARRIVAL_GUARD_KEY, "1");
    setQuickAddOpen(true);
    router.replace("/user/products");
    setTimeout(() => sessionStorage.removeItem(QUICK_ADD_ARRIVAL_GUARD_KEY), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  // Root cause of the focus-restore bug: Radix Dialog only restores focus to
  // `context.triggerRef`, which is populated exclusively by `DialogTrigger`.
  // We use two plain buttons (header + empty-state) as triggers, so that ref
  // is never set. Track whichever one was actually clicked ourselves and
  // hand it to `onCloseAutoFocus` below instead.
  const quickAddTriggerRef = useRef<HTMLButtonElement | null>(null);
  const openQuickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    quickAddTriggerRef.current = e.currentTarget;
    setQuickAddOpen(true);
  };

  // Restore the search term after mount (not in the initial useState) so the
  // first client render always matches the server render — same hydration-safety
  // pattern as T16 item 2, applied here to avoid reintroducing that bug.
  useEffect(() => {
    const saved = sessionStorage.getItem(PRODUCTS_SEARCH_KEY);
    if (saved) setSearchTerm(saved);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    sessionStorage.setItem(PRODUCTS_SEARCH_KEY, value);
  };

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
      <div className="max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] lg:max-w-[calc(100vw-12rem)] xl: mx-auto px-4 py-8">
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
          {/* Header Section - Sticky */}
          <div className="sticky top-0 z-40 mb-8 -mx-8 px-8 py-4 bg-gray-50/95 backdrop-blur-md">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5 rounded-2xl"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                {/* ponytail: title+buttons switch to a single side-by-side row only at
                    lg (1024px). The two-button group's content width (~322px, buttons
                    are shrink-0/whitespace-nowrap by design) doesn't fit next to the
                    title between 640-1000px — confirmed by measuring actual overflow
                    there. Below lg, stay stacked/full-width (verified overflow-free at
                    every width down to 320px) rather than guessing a narrower breakpoint. */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-xl shadow-md">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        My Products
                      </h1>
                      <p className="text-gray-600 text-sm mt-0.5">
                        Manage and track your product inventory
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full lg:w-auto sm:flex-row sm:gap-3">
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 font-semibold w-full sm:w-auto"
                      onClick={() => router.push("/user/products/add?mode=advanced")}
                    >
                      Add Detailed Product
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2.5 shadow-md hover:shadow-lg transition-all duration-200 font-semibold w-full sm:w-auto"
                      onClick={openQuickAdd}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Quick Add
                    </Button>
                  </div>
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
                  onChange={(e) => handleSearchChange(e.target.value)}
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
                  onClick={openQuickAdd}
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

      {/* Quick Add modal shell — T1.1/T1.2. Sticky header outside scroll region;
          QuickAddProduct owns its own scrollable body + sticky footer internally. */}
      <Dialog open={quickAddOpen} onOpenChange={setQuickAddOpen}>
        <DialogContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            quickAddTriggerRef.current?.focus();
          }}
          className="flex flex-col gap-0 overflow-hidden p-0
            w-screen h-[100dvh] max-w-none max-h-[100dvh] rounded-none top-0 left-0 translate-x-0 translate-y-0
            sm:w-[92vw] sm:max-w-[1440px] sm:h-[85dvh] sm:rounded-lg
            sm:top-[50%] sm:left-[50%] sm:-translate-x-1/2 sm:-translate-y-1/2"
        >
          <div className="shrink-0 flex items-center gap-3 border-b border-gray-100 px-6 py-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Quick add product
            </DialogTitle>
            <DialogDescription className="sr-only">
              Create a new product to add to your inventory.
            </DialogDescription>
          </div>
          <div className="flex-1 min-h-0">
            <QuickAddProduct
              onSwitchToAdvanced={() => {
                setQuickAddOpen(false);
                router.push("/user/products/add?mode=advanced");
              }}
              onSuccess={() => setQuickAddOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ProductsPage: React.FC = () => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    }
  >
    <ProductsPageInner />
  </Suspense>
);

export default ProductsPage;

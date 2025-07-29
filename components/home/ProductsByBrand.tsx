"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/lib/useUserInfo";
import { useSharedState } from "@/stores/sharedStore";
import { Skeleton } from "../ui/skeleton";
import ProductCardSkeleton from "../shared/ProductCardSkeleton";
import { ProductCardTypes } from "@/types/product";
import { FALLBACK_COMPANY_IMAGE } from "@/lib/fallbackImages";
import { Seller } from "@/types/home";

const ProductCard = dynamic(() => import("@/components/product/ProductCard"));



const ProductsByBrand: React.FC = () => {
  const { user } = useUserInfo();
  const { sellersLoading, sellers } = useSharedState();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>(
    sellers?.[0]?._id || ""
  );
  const [products, setProducts] = useState<ProductCardTypes[]>(
    sellers?.[0]?.products || []
  );

  useEffect(() => {
    if (sellers && sellers.length > 0) {
      // If no seller is selected yet, default to first
      if (!selectedTab) {
        const first = sellers[0];
        setSelectedTab(first._id);
        setProducts(first.products || []);
      } else {
        const current = sellers.find((s) => s._id === selectedTab);
        setProducts(current?.products || []);
      }
    }
  }, [sellers, selectedTab]);

  const handleTabClick = (seller: Seller) => {
    setSelectedTab(seller._id);
    setProducts(seller.products || []);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-green-50/30 py-8 md:py-12 lg:py-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_rgba(34,197,94,0.1)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_rgba(16,185,129,0.1)_0%,_transparent_50%)]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col items-center gap-6 md:gap-8 lg:gap-10">
          {/* Enhanced Header with Trust Badge */}
          <div className="text-center space-y-4 md:space-y-6">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified Suppliers
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
              Browse Products by{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
                  Top Suppliers
                </span>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </span>
            </h1>
            
            <p className="text-gray-600 text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              Discover premium polymer products from our network of trusted manufacturers and suppliers across Saudi Arabia and the GCC region
            </p>
          </div>

          {/* Enhanced Supplier Tabs with Better Mobile Layout */}
          <div className="w-full">
            {/* Mobile Layout - Horizontal Scroll */}
            <div className="md:hidden">
              <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-2">
                {sellersLoading &&
                  Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-[calc(75%-0.5rem)] flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm"
                    >
                      <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-24 rounded" />
                        <Skeleton className="h-3 w-16 rounded" />
                      </div>
                    </div>
                  ))}
                
                {sellers.map((seller) => (
                  <button
                    key={seller._id}
                    type="button"
                    onClick={() => handleTabClick(seller)}
                    className={`flex-shrink-0 w-[calc(75%-0.5rem)] flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      selectedTab === seller._id
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                        : "border border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50 bg-white"
                    }`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden ring-1 ring-white/30">
                      <Image
                        src={seller.company_logo || FALLBACK_COMPANY_IMAGE}
                        alt="Supplier Logo"
                        width={40}
                        height={40}
                        className="rounded-lg object-cover w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_COMPANY_IMAGE;
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-semibold truncate leading-tight">
                        {seller.company}
                      </div>
                      <div className="text-xs opacity-80 mt-0.5">
                        {seller.products?.length || 0} products
                      </div>
                    </div>
                    
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      selectedTab === seller._id ? "bg-white" : "bg-green-500"
                    }`} />
                  </button>
                ))}
                
                <button
                  type="button"
                  onClick={() => router.push("/suppliers")}
                  className="flex-shrink-0 w-[calc(60%-0.5rem)] flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-green-400 text-green-600 hover:border-green-500 hover:bg-green-50 transition-all duration-300 bg-green-50/50"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold">View All</div>
                    <div className="text-xs opacity-75">Suppliers</div>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Desktop Layout - Flex Wrap */}
            <div className="hidden md:flex flex-wrap gap-4 justify-center max-w-6xl mx-auto">
              {sellersLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    className="flex items-center gap-4 px-6 py-4 rounded-2xl min-w-60 min-h-24 border border-gray-200 bg-white shadow-sm"
                    key={index}
                  >
                    <Skeleton className="w-16 h-16 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-36 rounded" />
                      <Skeleton className="h-3 w-24 rounded" />
                    </div>
                  </div>
                ))}
              
              {sellers.map((seller) => (
                <button
                  key={seller._id}
                  type="button"
                  onClick={() => handleTabClick(seller)}
                  className={`group relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 min-w-60 min-h-24 overflow-hidden ${
                    selectedTab === seller._id
                      ? "bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white shadow-lg shadow-green-200/50"
                      : "border border-gray-200 text-gray-700 hover:border-green-300 hover:bg-white hover:shadow-lg bg-white/80 backdrop-blur-sm"
                  }`}
                >
                  {/* Selected Tab Glow Effect */}
                  {selectedTab === seller._id && (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 opacity-20 blur-xl"></div>
                  )}
                  
                  <div className="relative flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-white/30 shadow-lg">
                    <Image
                      src={seller.company_logo || FALLBACK_COMPANY_IMAGE}
                      alt="Supplier Logo"
                      width={64}
                      height={64}
                      className="rounded-2xl object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_COMPANY_IMAGE;
                      }}
                    />
                  </div>
                  
                  <div className="relative flex-1 text-left">
                    <span className="text-base font-semibold truncate block leading-snug">
                      {seller.company}
                    </span>
                    <span className="text-xs opacity-80 block mt-1">
                      {seller.products?.length || 0} products available
                    </span>
                  </div>
                  
                  <div className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                    selectedTab === seller._id ? "bg-white shadow-sm" : "bg-green-500 group-hover:bg-green-600"
                  }`} />
                </button>
              ))}

              {/* Enhanced "See More" Button */}
              <button
                type="button"
                onClick={() => router.push("/suppliers")}
                className="group relative flex items-center justify-center gap-4 px-6 py-4 rounded-2xl border-2 border-dashed border-green-400 text-green-600 hover:border-green-500 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 min-w-48 min-h-24 bg-gradient-to-br from-green-50/50 to-emerald-50/50 backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                
                <div className="relative w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg group-hover:from-green-600 group-hover:to-emerald-700 transition-all duration-300 shadow-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                
                <div className="relative text-center">
                  <span className="font-semibold text-sm block">View All</span>
                  <span className="text-xs opacity-75">Suppliers</span>
                </div>
              </button>
            </div>
          </div>

          {/* Enhanced Product Grid with Modern Cards */}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {sellersLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="transform transition-all duration-300 hover:scale-105">
                    <ProductCardSkeleton />
                  </div>
                ))}
              {products?.slice(0, 4).map((product) => (
                <div key={product._id} className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <ProductCard
                    product={product}
                    userType={user?.user_type}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced CTA Section */}
          <div className="text-center space-y-6 pt-8">
            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                Ready to Explore More?
              </h3>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Discover thousands of polymer products from verified suppliers
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 md:px-12 py-4 rounded-2xl text-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-3"
                onClick={() => router.push("/products")}
              >
                <span className="relative z-10">View All Products</span>
                <div className="relative z-10 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <button
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 font-semibold"
                onClick={() => router.push("/suppliers")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Browse Suppliers</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsByBrand;

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

const ProductCard = dynamic(() => import("@/components/product/ProductCard"));

interface ProductImage {
  fileUrl: string;
}

interface Seller {
  _id: string;
  company: string;
  company_logo: string;
  products?: ProductCardTypes[];
}

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
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center gap-8 md:gap-12">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 bg-clip-text text-transparent">
            Find Products By Suppliers
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Browse products from our verified suppliers and discover quality materials from trusted manufacturers
          </p>
        </div>

        {/* Enhanced Supplier Tabs */}
        <div className="w-full">
          <div className="flex flex-wrap gap-3 justify-center max-w-6xl mx-auto">
            {sellersLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl w-[48%] sm:w-auto md:min-w-52 md:min-h-20 border-2 border-gray-200 bg-gray-50"
                  key={index}
                >
                  <Skeleton className="w-10 h-10 md:w-14 md:h-14 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24 md:w-32 rounded" />
                    <Skeleton className="h-3 w-16 md:w-20 rounded" />
                  </div>
                </div>
              ))}
            
            {sellers.map((seller) => (
              <button
                key={seller._id}
                type="button"
                onClick={() => handleTabClick(seller)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 w-[48%] sm:w-auto md:min-w-52 md:min-h-20 shadow-md hover:shadow-lg ${
                  selectedTab === seller._id
                    ? "bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white shadow-green-200"
                    : "border-2 border-green-200 text-gray-700 hover:border-green-400 hover:bg-green-50 bg-white"
                }`}
              >
                <div className="flex-shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden ring-2 ring-white/20">
                  <Image
                    src={seller.company_logo}
                    alt="Supplier Logo"
                    width={56}
                    height={56}
                    className="rounded-full object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm md:text-base font-semibold truncate block">
                    {seller.company}
                  </span>
                  <span className="text-xs opacity-80 block">
                    {seller.products?.length || 0} products
                  </span>
                </div>
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  selectedTab === seller._id ? "bg-white" : "bg-green-500"
                }`} />
              </button>
            ))}

            <button
              type="button"
              onClick={() => router.push("/suppliers")}
              className="group flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border-2 border-dashed border-green-400 text-green-600 hover:border-green-500 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 w-[48%] sm:w-auto md:min-w-40 md:min-h-20 bg-gradient-to-br from-green-50 to-emerald-50"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold group-hover:bg-green-600 transition-colors">
                +
              </div>
              <div className="text-center">
                <span className="font-semibold text-sm block">See More</span>
                <span className="text-xs opacity-75">Suppliers</span>
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Product Grid */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {sellersLoading &&
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="transform transition-all duration-300 hover:scale-105">
                  <ProductCardSkeleton />
                </div>
              ))}
            {products?.slice(0, 4).map((product) => (
              <div key={product._id} className="transform transition-all duration-300 hover:scale-105">
                <ProductCard
                  product={product}
                  userType={user?.user_type}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Button */}
        <div className="flex items-center justify-center">
          <button
            className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 md:px-12 py-4 rounded-2xl text-sm md:text-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
            onClick={() => router.push("/products")}
          >
            <span className="relative z-10">Explore All Products</span>
            <div className="relative z-10 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
              <span className="text-sm">→</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsByBrand;

"use client";
import React, { useState, useMemo, useEffect } from "react";
import CategoryCard from "./CategoryCard";
import Tab from "./Tab";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useIsMobile from "@/lib/useIsMobile";
import { Skeleton } from "../ui/skeleton";
import { useSharedState } from "@/stores/sharedStore";

interface CategoryData {
  id: string;
  name: string;
  icon: string;
}

interface IndustryItem {
  _id: string;
  name: string;
  bg: string;
  image: string;
}

interface ProductFamily {
  _id: string;
  name: string;
  image: string;
}

const categoryData: CategoryData[] = [
  {
    id: "industries",
    name: "Product Industries",
    icon: "/assets/industries-logo.png",
  },
  {
    id: "families",
    name: "Product Families",
    icon: "/assets/product-families-logo.png",
  },
];

const Categories: React.FC = () => {
  const { industriesLoading, familiesLoading, industries, productFamilies } =
    useSharedState();
  const [selectedCategory, setSelectedCategory] =
    useState<string>("industries");
  const isMobile = useIsMobile();
  const router = useRouter();

  const displayedItems = useMemo(() => {
    const data =
      selectedCategory === "industries" ? industries : productFamilies;

    const sliced = data.length > 9 ? data.slice(0, 9) : data;
    return isMobile ? sliced.slice(0, 4) : sliced;
  }, [selectedCategory, isMobile, industries, productFamilies]);

  const shouldShowViewAll =
    (selectedCategory === "industries"
      ? industries.length
      : productFamilies.length) > 9 && !isMobile;
  return (
    <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
      <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-12">
        {/* Enhanced Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 bg-clip-text text-transparent leading-tight">
            Discover Our Products
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-xs sm:max-w-md md:max-w-2xl mx-auto leading-relaxed">
            Explore our comprehensive range of polymer products across various industries and product families
          </p>
        </div>

        {/* Enhanced Tab Design */}
        <div className="flex justify-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-x-auto w-full max-w-md sm:max-w-lg">
          {categoryData.map(({ id, name, icon }) => (
            <Tab
              key={id}
              name={name}
              icon={icon}
              isSelected={selectedCategory === id}
              onClick={() => setSelectedCategory(id)}
              iconWidth="w-8 md:w-12 lg:w-14"
              fontSize="text-xs md:text-sm lg:text-base font-medium"
            />
          ))}
        </div>

        {/* Enhanced Grid Layout */}
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {(industriesLoading || familiesLoading) &&
              Array.from({ length: isMobile ? 4 : 10 }).map((_, index) => (
                <div key={index} className="group">
                  <Skeleton className="w-full h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] xl:h-[200px] rounded-xl sm:rounded-2xl shadow-sm" />
                </div>
              ))}
            
            {displayedItems.map((item, index) => (
              <div key={item?._id || index} className="group hover:scale-105 transition-all duration-300">
                <CategoryCard
                  name={item?.name}
                  image={
                    selectedCategory === "industries"
                      ? (item as IndustryItem).bg
                      : (item as ProductFamily).image
                  }
                  id={item?._id}
                  selectedCategory={selectedCategory}
                />
              </div>
            ))}

            {shouldShowViewAll && (
              <div className="hidden lg:flex group">
                <div
                  className="w-full border-2 border-dashed border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl cursor-pointer hover:border-green-500 hover:bg-gradient-to-br hover:from-green-100 hover:to-emerald-100 transition-all duration-300 group-hover:scale-105 min-h-[120px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[180px] xl:min-h-[200px]"
                  onClick={() =>
                    router.push(
                      selectedCategory === "industries"
                        ? "/industries"
                        : "/product-families"
                    )
                  }
                >
                  <div className="text-center space-y-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-green-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold group-hover:bg-green-600 transition-colors">
                      +
                    </div>
                    <button className="text-green-700 text-sm lg:text-base font-semibold">
                      View All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile View All Button */}
        {isMobile && (
          <div className="w-full flex justify-center">
            <button
              onClick={() =>
                router.push(
                  selectedCategory === "industries"
                    ? "/industries"
                    : "/product-families"
                )
              }
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
            >
              <span>View All {selectedCategory === "industries" ? "Industries" : "Product Families"}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        )}

        {/* Enhanced Mobile Button */}
        <button
          type="button"
          className="flex md:hidden items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          onClick={() =>
            router.push(
              selectedCategory === "industries"
                ? "/industries"
                : "/product-families"
            )
          }
        >
          <span>See More</span>
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
            <Image
              src="/icons/lucide_arrow-up.svg"
              alt="Arrow Icon"
              width={16}
              height={16}
              className="rotate-90 filter brightness-0 invert"
            />
          </div>
        </button>
      </div>
    </section>
  );
};

export default Categories;

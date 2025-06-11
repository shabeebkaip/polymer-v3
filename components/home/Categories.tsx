"use client";
import React, { useState, useMemo, useEffect } from "react";
import CategoryCard from "./CategoryCard";
import Tab from "./Tab";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useIsMobile from "@/lib/useIsMobile";

import { getIndustryList, getProductFamilies } from "@/apiServices/shared";

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

interface CategoriesProps {
  industries: IndustryItem[];
  productFamiliesList: ProductFamily[];
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

const Categories: React.FC<CategoriesProps> = ({
  industries,
  productFamiliesList,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("industries");
  const isMobile = useIsMobile();
  const router = useRouter();

  const displayedItems = useMemo(() => {
    const data =
      selectedCategory === "industries" ? industries : productFamiliesList;

    const sliced = data.length > 9 ? data.slice(0, 9) : data;
    return isMobile ? sliced.slice(0, 4) : sliced;
  }, [selectedCategory, isMobile, industries, productFamiliesList]);

  const shouldShowViewAll =
    (selectedCategory === "industries"
      ? industries.length
      : productFamiliesList.length) > 9 && !isMobile;
  return (
    <section className="container mx-auto px-4 mt-20 mb-10">
      <div className="flex flex-col items-center gap-6 md:gap-14">
        <h1 className="text-[var(--dark-main)] text-3xl md:text-5xl font-normal text-center">
          Discover Our Products
        </h1>

        <div className="grid grid-cols-2 justify-center gap-2 md:gap-10">
          {categoryData.map(({ id, name, icon }) => (
            <Tab
              key={id}
              name={name}
              icon={icon}
              isSelected={selectedCategory === id}
              onClick={() => setSelectedCategory(id)}
              iconWidth="w-8 md:w-12 lg:w-14"
              fontSize="text-[10px] md:text-sm lg:text-base"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-3 w-full">
          {displayedItems.map((item, index) => (
            <CategoryCard
              key={item?._id || index}
              name={item?.name}
              image={
                selectedCategory === "industries"
                  ? (item as IndustryItem).bg
                  : (item as ProductFamily).image
              }
              id={item?._id}
              selectedCategory={selectedCategory}
            />
          ))}

          {shouldShowViewAll && (
            <div
              className="hidden md:flex bg-[var(--green-light)] text-white items-center justify-center gap-2 rounded-t-2xl rounded-b-xl md:rounded-t-4xl md:rounded-b-3xl overflow-hidden shadow-lg cursor-pointer hover:opacity-90 transition"
              onClick={() =>
                router.push(
                  selectedCategory === "industries"
                    ? "/industries"
                    : "/product-families"
                )
              }
            >
              <button className="font-medium text-sm md:text-2xl flex items-center gap-1 text-white hover:underline">
                View All <span>→</span>
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex md:hidden items-center gap-4 px-4 py-2 rounded-full border-2 border-[var(--green-main)] text-[var(--green-main)] text-xs md:text-md hover:bg-green-50 transition focus:outline-none"
          onClick={() =>
            router.push(
              selectedCategory === "industries"
                ? "/industries"
                : "/product-families"
            )
          }
        >
          See More{" "}
          <Image
            src="/icons/lucide_arrow-up.svg"
            alt="Arrow Icon"
            width={20}
            height={20}
          />
        </button>
      </div>
    </section>
  );
};

export default Categories;

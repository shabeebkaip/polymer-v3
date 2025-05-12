"use client";
import React, { useState, useMemo, useEffect } from "react";
import CategoryCard from "./CategoryCard";
import Tab from "./Tab";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useIsMobile from "@/lib/useIsMobile";

import {
  getIndustryList,
  getProductFamilies,
} from "@/apiServices/shared";

// Types
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
  const [selectedCategory, setSelectedCategory] =
    useState<string>("industries");
  const [industriesList, setIndustriesList] = useState<IndustryItem[]>([]);
  const [productFamilies, setProductFamilies] = useState<ProductFamily[]>([]);
  const isMobile = useIsMobile();
  const router = useRouter();

  const displayedItems = useMemo(() => {
    const data =
      selectedCategory === "industries" ? industriesList : productFamilies;

    const sliced = data.length > 9 ? data.slice(0, 9) : data;
    return isMobile ? sliced.slice(0, 4) : sliced;
  }, [selectedCategory, isMobile, industriesList, productFamilies]);

  const shouldShowViewAll =
    (selectedCategory === "industries"
      ? industriesList.length
      : productFamilies.length) > 9 && !isMobile;

  useEffect(() => {
    getIndustryList().then((response) => {
      setIndustriesList(
        response?.data?.map((item: IndustryItem) => ({
          ...item,
          image: item.bg,
        }))
      );
    });

    getProductFamilies().then((response) => {
      const simplifiedFamilies: ProductFamily[] = response?.data?.map(
        (item: any) => ({
          _id: item._id,
          name: item.name,
          image: item.image,
        })
      );
      setProductFamilies(simplifiedFamilies);
    });
  }, []);

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
              iconWidth="w-10 md:w-20"
              fontSize="text-[12px] md:text-lg lg:text-[22px]"
            />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-3 w-full">
          {displayedItems.map(({ name, image, _id }, index) => (
            <CategoryCard key={_id || index} name={name} image={image} />
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
              <h4 className="font-medium text-sm md:text-2xl">View All</h4>
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

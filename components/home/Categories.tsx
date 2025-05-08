"use client";
import React, { useState, useMemo, useEffect } from "react";
import CategoryCard from "./CategoryCard";
import Tab from "./Tab";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Hook to check if screen is mobile (<768px)
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const categoryData = [
  {
    id: "industries",
    label: "Product Industries",
    icon: "/assets/industries-logo.png",
  },
  {
    id: "families",
    label: "Product Families",
    icon: "/assets/product-families-logo.png",
  },
];

const industries = [
  {
    id: "biotech",
    label: "Bio Technology",
    image: "/assets/industry (1).png",
  },
  {
    id: "pharma",
    label: "Pharma & Life Sciences",
    image: "/assets/industry (2).png",
  },
  {
    id: "chemical",
    label: "Chemical Manufacturing",
    image: "/assets/industry (3).png",
  },
  {
    id: "packaging",
    label: "Packaging",
    image: "/assets/industry (1).png",
  },
  {
    id: "automotive",
    label: "Automotive",
    image: "/assets/industry (2).png",
  },
  {
    id: "medical",
    label: "Medical & Healthcare",
    image: "/assets/industry (3).png",
  },
  {
    id: "textile",
    label: "Textile & Apparel",
    image: "/assets/industry (1).png",
  },
  {
    id: "electronics",
    label: "Electronics & Electrical",
    image: "/assets/industry (2).png",
  },
  {
    id: "construction",
    label: "Construction & Building",
    image: "/assets/industry (3).png",
  },
];

const Categories: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("industries");
  const isMobile = useIsMobile();
  const router = useRouter();

  // Return only 4 items on mobile, all on larger screens
  const displayedItems = useMemo(() => {
    const data = selectedCategory === "industries" ? industries : industries;
    return isMobile ? data.slice(0, 4) : data;
  }, [selectedCategory, isMobile]);

  return (
    <section className="container mx-auto px-4 mt-20 mb-10">
      <div className="flex flex-col items-center gap-6 md:gap-14">
        <h1 className="text-[var(--dark-main)] text-3xl md:text-5xl font-normal text-center">
          Discover Our Products
        </h1>

        <div className="grid grid-cols-2 justify-center gap-2 md:gap-10">
          {categoryData.map(({ id, label, icon }) => (
            <Tab
              key={id}
              label={label}
              icon={icon}
              isSelected={selectedCategory === id}
              onClick={() => setSelectedCategory(id)}
              iconWidth="w-10 md:w-20"
              fontSize="text-[12px] md:text-lg lg:text-[22px]"
            />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-3 w-full">
          {displayedItems.map(({ id, label, image }) => (
            <CategoryCard key={id} label={label} image={image} />
          ))}

          <div
            className="hidden md:flex bg-[var(--green-light)] text-white items-center justify-center gap-2 rounded-t-2xl rounded-b-xl md:rounded-t-4xl md:rounded-b-3xl overflow-hidden shadow-lg cursor-pointer hover:opacity-90 transition"
            onClick={() =>
              router.push(
                selectedCategory == "industries"
                  ? "/industries"
                  : "/product-families"
              )
            }
          >
            <h4 className="font-medium text-sm md:text-2xl">View All</h4>
          </div>
        </div>
        <button
          type="button"
          className="flex md:hidden items-center gap-4 px-4 py-2 rounded-full border-2 border-[var(--green-main)] text-[var(--green-main)] text-xs md:text-md hover:bg-green-50 transition focus:outline-none"
          onClick={() =>
            router.push(
              selectedCategory == "industries"
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

"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import Tab from "./Tab";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProductCard = dynamic(() => import("@/components/Products/ProductCard"));

const ProductsByBrand: React.FC = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("brand1");
  const brands = [
    { id: "brand1", label: "Onfido", image: "/assets/brand.png" },
    { id: "brand2", label: "Onfido", image: "/assets/brand.png" },
    { id: "brand3", label: "Onfido", image: "/assets/brand.png" },
    { id: "brand4", label: "Onfido", image: "/assets/brand.png" },
    { id: "brand5", label: "Onfido", image: "/assets/brand.png" },
    { id: "brand6", label: "Onfido", image: "/assets/brand.png" },
    { id: "brand7", label: "Onfido", image: "/assets/brand.png" },
  ];
  const products = [
    {
      image: "/assets/house_big.png",
      logo: "/assets/seller 1.svg",
    },
    {
      image: "/assets/house_big (1).png",
      logo: "/assets/seller 2.svg",
    },
    {
      image: "/assets/house_big (2).png",
      logo: "/assets/seller 3.svg",
    },
    {
      image: "/assets/house_big (3).png",
      logo: "/assets/seller 2.svg",
    },
  ];
  return (
    <div className="container mx-auto px-4 mt-16">
      <div className="flex flex-col items-center gap-6 md:gap-14">
        <h1 className="text-[var(--dark-main)] text-3xl md:text-5xl font-normal text-center">
          Find Product By Brand
        </h1>
        <div className="flex flex-wrap gap-4 justify-center">
          {brands.map((brand) => (
            <Tab
              key={brand.id}
              label={brand.label}
              icon={brand.image}
              isSelected={selectedTab === brand.id}
              onClick={() => setSelectedTab(brand.id)}
              fontSize="text-xs md:text-[22px]"
              iconWidth="w-6 md:w-10 "
            />
          ))}
          <button
            type="button"
            className="flex items-center gap-4 px-4 py-2 rounded-full border-2 border-[var(--green-main)] text-xs md:text-lg text-[var(--green-main)] hover:bg-green-50 transition focus:outline-none"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
        <div className="flex items-center justify-center ">
          <button
            className="border border-[var(--green-light)] px-10 md:px-20 py-4 md:py-4 rounded-full text-[var(--green-light)] text-sm md:text-lg hover:bg-green-50 transition focus:outline-none flex items-center gap-2"
            onClick={() => router.push("/products")}
          >
            View All
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsByBrand;

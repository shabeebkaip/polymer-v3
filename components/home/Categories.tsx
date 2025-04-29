"use client";
import Image from "next/image";
import React from "react";
import CategoryCard from "./CategoryCard";

const categoryData = [
  {
    id: "industries",
    label: "Industries",
    icon: "/assets/industries-logo.png",
  },
  {
    id: "families",
    label: "Product Families",
    icon: "/assets/product-families-logo.png",
  },
  // …add more here
];

const industries = [
  {
    id: "biotechnology",
    label: "Bio Technology",
    image: "/assets/industry (1).png",
  },
  {
    id: "pharma_lifesciences",
    label: "Pharma & Life Sciences",
    image: "/assets/industry (2).png",
  },
  {
    id: "chemical_manufacturing",
    label: "Chemical Manufacturing",
    image: "/assets/industry (3).png",
  },
  {
    id: "biotechnology",
    label: "Bio Technology",
    image: "/assets/industry (1).png",
  },
  {
    id: "pharma_lifesciences",
    label: "Pharma & Life Sciences",
    image: "/assets/industry (2).png",
  },
  {
    id: "chemical_manufacturing",
    label: "Chemical Manufacturing",
    image: "/assets/industry (3).png",
  },
  {
    id: "pharma_lifesciences",
    label: "Pharma & Life Sciences",
    image: "/assets/industry (2).png",
  },
];

const Categories: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    React.useState<string>("industries");

  return (
    <section className="container mx-auto px-4 mt-20 mb-10">
      <div className="flex flex-col items-center gap-16">
        <h1 className="text-[var(--dark-main)] text-5xl">
          Discover Our Products
        </h1>

        <div className="flex flex-wrap justify-center gap-10">
          {categoryData.map(({ id, label, icon }) => {
            const isSelected = selectedCategory === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedCategory(id)}
                className={`
                  flex items-center gap-4
                  px-4 py-2
                  rounded-full
                  transition
                  focus:outline-none

                  ${
                    isSelected
                      ? "bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white"
                      : " border-2 border-[var(--green-main)] text-[var(--green-main)] hover:bg-green-50"
                  }
                `}
              >
                <div className="flex-shrink-0 w-16 h-16  rounded-full flex items-center justify-center">
                  <Image
                    src={icon}
                    alt={label}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                  />
                </div>
                <span className="text-2xl font-medium">{label}</span>
              </button>
            );
          })}
        </div>
        <div>
          <div className="grid grid-cols-4 gap-10 mt-10">
            {selectedCategory === "industries"
              ? industries.map(({ id, label, image }, index) => (
                  <CategoryCard
                    id={id}
                    label={label}
                    image={image}
                    key={index}
                  />
                ))
              : industries.map(({ id, label, image }, index) => (
                  <CategoryCard
                    id={id}
                    label={label}
                    image={image}
                    key={index}
                  />
                ))}
            <div className="bg-[var(--green-light)] text-white flex items-center justify-center gap-2 rounded-t-4xl rounded-b-2xl  overflow-hidden shadow-lg">
              <h4 className="font-medium text-3xl">View All</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;

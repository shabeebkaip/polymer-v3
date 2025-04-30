"use client";
import React, { useState, useMemo } from "react";
import CategoryCard from "./CategoryCard";
import Tab from "./Tab";

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
];

const Categories: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("industries");

  // Simulated data for both categories
  const displayedItems = useMemo(() => {
    return selectedCategory === "industries" ? industries : industries;
  }, [selectedCategory]);

  return (
    <section className="container mx-auto px-4 mt-20 mb-10">
      <div className="flex flex-col items-center gap-14">
        <h1 className="text-[var(--dark-main)] text-5xl font-bold text-center">
          Discover Our Products
        </h1>

        <div className="flex flex-wrap justify-center gap-10">
          {categoryData.map(({ id, label, icon }) => (
            <Tab
              key={id}
              label={label}
              icon={icon}
              isSelected={selectedCategory === id}
              onClick={() => setSelectedCategory(id)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 w-full">
          {displayedItems.map(({ id, label, image }) => (
            <CategoryCard key={id} id={id} label={label} image={image} />
          ))}

          <div className="bg-[var(--green-light)] text-white flex items-center justify-center gap-2 rounded-t-4xl rounded-b-3xl overflow-hidden shadow-lg  cursor-pointer hover:opacity-90 transition">
            <h4 className="font-medium text-2xl">View All</h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;

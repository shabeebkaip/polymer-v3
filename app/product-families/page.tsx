import CategoryCard from "@/components/home/CategoryCard";
import React from "react";

const Page: React.FC = () => {
  const productFamilies = [
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
  ];
  return (
    <div className="container mx-auto px-4 my-10 ">
      <h1 className="text-4xl text-[var(--dark-main)]">Product Familes</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
        {productFamilies.map((family, index) => (
          <CategoryCard
            label={family?.label}
            image={family?.image}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;

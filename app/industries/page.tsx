"use client";
import React, { useEffect, useState } from "react";
import CategoryCard from "@/components/home/CategoryCard";
import { getIndustryList } from "@/apiServices/shared";

interface IndustryItem {
  _id: string;
  name: string;
  bg: string;
  image: string;
}

const Page: React.FC = () => {
  const [industries, setIndustries] = useState<IndustryItem[]>([]);

  useEffect(() => {
    getIndustryList().then((response) => {
      const data = response?.data?.map((item: any) => ({
        _id: item._id,
        name: item.name,
        image: item.bg, // Normalizing bg to image
        bg: item.bg,
      }));
      setIndustries(data);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 my-10">
      <h1 className="text-4xl text-[var(--dark-main)]">Industries</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
        {industries.map((industry) => (
          <CategoryCard
            key={industry._id}
            name={industry.name}
            image={industry.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;

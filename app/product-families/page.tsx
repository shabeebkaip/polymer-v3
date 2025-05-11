"use client";
import React, { useEffect, useState } from "react";
import CategoryCard from "@/components/home/CategoryCard";
import { getProductFamilies } from "@/apiServices/shared/apiServices";

interface ProductFamily {
  _id: string;
  name: string;
  image: string;
}

const Page: React.FC = () => {
  const [productFamilies, setProductFamilies] = useState<ProductFamily[]>([]);

  useEffect(() => {
    getProductFamilies().then((response) => {
      const data = response?.data?.map((item: any) => ({
        _id: item._id,
        name: item.name,
        image: item.image,
      }));
      setProductFamilies(data);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 my-10">
      <h1 className="text-4xl text-[var(--dark-main)]">Product Families</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
        {productFamilies.map((family) => (
          <CategoryCard
            key={family._id}
            name={family.name}
            image={family.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;

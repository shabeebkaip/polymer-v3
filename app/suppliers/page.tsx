import SearchBar from "@/components/Products/SearchBar";
import SupplierCard from "@/components/suppliers/SupplierCard";
import React from "react";

const SuppliersPage: React.FC = () => {
  const suppliers = [
    {
      logo: "/assets/seller 1.svg",
      name: "Pure Health Ingredients (shanghi) co,Itd",
      location: "Shanghai, China",
    },
    {
      logo: "/assets/seller 2.svg",
      name: "Pure Health Ingredients (shanghi) co,Itd",
      location: "Shanghai, China",
    },
    {
      logo: "/assets/seller 3.svg",
      name: "Pure Health Ingredients (shanghi) co,Itd",
      location: "Shanghai, China",
    },
    {
      logo: "/assets/seller 2.svg",
      name: "Pure Health Ingredients (shanghi) co,Itd",
      location: "Shanghai, China",
    },
    {
      logo: "/assets/seller 1.svg",
      name: "Pure Health Ingredients (shanghi) co,Itd",
      location: "Shanghai, China",
    },
  ];
  return (
    <section className="mt-10 container mx-auto px-4 ">
      <div className="grid grid-cols-12 gap-4 mb-10">
        <div className="col-span-12 grid grid-cols-12 gap-4 ">
          <div className="hidden  md:block  md:col-span-2  "></div>
          <div className="col-span-12  md:col-span-8">
            <SearchBar />
          </div>
          <div className="hidden md:block  md:col-span-2"></div>
        </div>
        <div className="col-span-12 grid grid-cols-12 gap-4 mt-4">
          {suppliers.map((supplier, index) => (
            <SupplierCard
              logo={supplier?.logo}
              name={supplier?.name}
              location={supplier?.location}
              key={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuppliersPage;

import SearchBar from "@/components/Products/SearchBar";
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
          <div className="col-span-2"></div>
          <div className="col-span-8">
            <SearchBar />
          </div>
          <div className="col-span-2"></div>
        </div>
        <div className="col-span-12 grid grid-cols-12 gap-4">
          {suppliers.map((supplier, index) => (
            <div
              key={index}
              className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 flex items-center justify-center"
            >
              <div className="rounded-xl p-4 w-full flex items-center border border-gray-200 ">
                <img
                  src={supplier.logo}
                  alt={supplier.name}
                  className="w-25 h-25 mr-4"
                />
                <div>
                  <h2 className="text-2xl font-normal text-[var(--dark-main)]">
                    {supplier.name}
                  </h2>
                  <p className="text-gray-500 text-xl">{supplier.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuppliersPage;

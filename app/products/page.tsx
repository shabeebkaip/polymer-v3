import Filter from "@/components/Products/Filter";
import Image from "next/image";
import React from "react";

const ProductsPage: React.FC = () => {
  const filters = [
    {
      name: "Supplier Location",
      filter_key: "supplier_location",
      searchable: true,
      options: [
        { name: "USA", value: "usa" },
        { name: "China", value: "china" },
        { name: "Germany", value: "germany" },
        { name: "India", value: "india" },
      ],
    },
    {
      name: "Quantity",
      filter_key: "quantity",
      searchable: false,
      options: [
        { name: "1-10", value: "1-10" },
        { name: "11-50", value: "11-50" },
        { name: "51-100", value: "51-100" },
        { name: "101+", value: "101+" },
      ],
    },

    {
      name: "Product Type",
      filter_key: "chemical_type",
      searchable: false,
      options: [
        { name: "Organic", value: "organic" },
        { name: "Inorganic", value: "inorganic" },
        { name: "Polymers", value: "polymers" },
        { name: "Biochemicals", value: "biochemicals" },
      ],
    },
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
    <section className="mt-10 container mx-auto px-4  ">
      <div className="grid grid-cols-12 gap-4 mb-10">
        <div className="col-span-3">
          <Filter
            filters={filters}
            onFilterChange={(selectedOption) => {
              console.log("Selected filter option:", selectedOption);
            }}
          />
        </div>
        <div className="col-span-9">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] rounded-full flex justify-center items-center absolute top-2 right-2">
              <Image
                src="/icons/search.svg"
                alt="Arrow Icon"
                width={20}
                height={20}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Search Polymers"
                className="w-full px-4 py-4 rounded-full border-1 border-[var(--green-light)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;

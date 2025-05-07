import dynamic from "next/dynamic";
import React from "react";

const Filter = dynamic(() => import("@/components/products/Filter"));
const ProductCard = dynamic(() => import("@/components/products/ProductCard"));
const SearchBar = dynamic(() => import("@/components/products/SearchBar"));

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
          <SearchBar />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;

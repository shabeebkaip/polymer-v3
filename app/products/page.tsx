//
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import SupplierBasic from "@/components/suppliers/SupplierBasic";

const Filter = dynamic(() => import("@/components/product/Filter"));
const SearchBar = dynamic(() => import("@/components/product/SearchBar"));
const ProductsList = dynamic(() => import("@/components/product/ProductsList"));

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

const ProductsPage = () => {
  return (
    <section className="mt-10 container mx-auto px-4">
      <SupplierBasic />
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
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductsList />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;

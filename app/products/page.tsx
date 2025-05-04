import Filter from "@/components/Products/Filter";
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
  return (
    <div className="mt-16 container mx-auto px-4">
      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <Filter
            filters={filters}
            onFilterChange={(selectedOption) => {
              console.log("Selected filter option:", selectedOption);
            }}
          />
        </div>
        <div className="col-span-9">products</div>
      </div>
      <h1>Products Page</h1>
      <p>Welcome to the products page!</p>
    </div>
  );
};

export default ProductsPage;

"use client";

import React, { useState } from "react";
import CompanyDetails from "@/components/product/CompanyDetails";
import ImageContainers from "@/components/product/ImageContainers";
import GeneralTabInformation from "./GeneralTabInformation";
import TradeInformation from "./TradeInformation";

// Interfaces
interface ProductImage {
  fileUrl: string;
  [key: string]: any;
}

interface Company {
  _id: string;
  company: string;
  company_logo: string;
  countryOfOrigin: string;
  website?: string;
  [key: string]: any;
}

interface Product {
  productName: string;
  productImages?: ProductImage[];
  createdBy?: Company;
  [key: string]: any;
}

interface ProductDetailClientProps {
  product: Product;
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "trade">("general");

  const tabs = [
    { key: "general", label: "General Product Information" },
    { key: "trade", label: "Trade Information" },
  ] as const;

  return (
    <section className="mt-10 container mx-auto px-4 pb-12">
      <h1 className="text-4xl font-normal text-[var(--dark-main)]">
        {product.productName}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10">
        {product?.productImages && product?.productImages?.length ? (
          <ImageContainers productImages={product.productImages} />
        ) : null}
        {product.createdBy && (
          <CompanyDetails
            companyDetails={product.createdBy}
            productId={product?._id}
            uom={product?.uom}
          />
        )}
      </div>

      {/* Tabs */}
      <div className="mt-10">
        <div className="border-b border-gray-300 flex md:gap-8 gap-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 md:text-2xl sm:text-xl text-base cursor-pointer ${activeTab === tab.key
                  ? "text-[var(--dark-main)] border-b-2 border-[var(--green-main)]"
                  : "text-[var(--text-gray-primary)]"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "general" && <GeneralTabInformation product={product} />}
        {activeTab === "trade" && <TradeInformation product={product} />}
      </div>
    </section>
  );
};

export default ProductDetailClient;

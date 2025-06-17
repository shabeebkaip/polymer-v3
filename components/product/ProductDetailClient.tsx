"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import CompanyDetails from "@/components/product/CompanyDetails";
import ImageContainers from "@/components/product/ImageContainers";
import GeneralTabInformation from "./GeneralTabInformation";
import TradeInformation from "./TradeInformation";
import { AnimatePresence, motion } from "framer-motion";

// Interfaces (same as your original)

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

const tabs = [
  { key: "general", label: "General Product Information" },
  { key: "trade", label: "Trade Information" },
] as const;

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "trade">("general");

  // For underline animation
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  const setTabRef = (el: HTMLButtonElement | null, idx: number) => {
    tabRefs.current[idx] = el;
  };

  useLayoutEffect(() => {
    const index = tabs.findIndex((tab) => tab.key === activeTab);
    const currentRef = tabRefs.current[index];
    if (currentRef) {
      const { offsetLeft, offsetWidth } = currentRef;
      setUnderline({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

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
        <div className="border-b border-gray-300 relative flex md:gap-8 gap-5">
          {tabs.map((tab, i) => (
            <button
              key={tab.key}
              ref={el => setTabRef(el, i)}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2 md:text-2xl sm:text-xl text-base cursor-pointer transition-colors duration-200 ${activeTab === tab.key
                ? "text-[var(--dark-main)]"
                : "text-[var(--text-gray-primary)]"
                }`}
            >
              {tab.label}
            </button>
          ))}
          {/* Animated underline */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute bottom-0 h-1 rounded bg-[var(--green-main)]"
            style={{
              left: underline.left,
              width: underline.width,
            }}
          />
        </div>
      </div>

      {/* Tab Content with Animation */}
      <div className="mt-6 min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === "general" && (
            <motion.div
              key="general"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
            >
              <GeneralTabInformation product={product} />
            </motion.div>
          )}
          {activeTab === "trade" && (
            <motion.div
              key="trade"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
            >
              <TradeInformation product={product} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </section>
  );
};

export default ProductDetailClient;

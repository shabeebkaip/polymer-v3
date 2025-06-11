"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getSellers } from "@/apiServices/shared";

const ProductCard = dynamic(() => import("@/components/product/ProductCard"));

interface ProductImage {
  fileUrl: string;
}

interface Product {
  _id: string;
  productName: string;
  tradeName: string;
  description: string;
  productImages: ProductImage[];
  price: number;
  uom: string;
}

interface Seller {
  _id: string;
  company: string;
  company_logo: string;
  products?: Product[];
}
interface ProductsByBrandProps {
  sellers: Seller[];
}

const ProductsByBrand: React.FC<ProductsByBrandProps> = ({ sellers }) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>(
    sellers?.[0]?._id || ""
  );
  const [products, setProducts] = useState<Product[]>(
    sellers?.[0]?.products || []
  );

  useEffect(() => {
    if (sellers && sellers.length > 0) {
      const currentSeller = sellers.find(
        (seller) => seller._id === selectedTab
      );
      setProducts(currentSeller?.products || []);
    }
  }, [selectedTab, sellers]);

  const handleTabClick = (seller: Seller) => {
    setSelectedTab(seller._id);
    setProducts(seller.products || []);
  };

  return (
    <div className="container mx-auto px-4 mt-16">
      <div className="flex flex-col items-center gap-6 md:gap-14">
        <h1 className="text-[var(--dark-main)] text-3xl md:text-5xl font-normal text-center">
          Find Product By Suppliers
        </h1>
        <div className="flex flex-wrap gap-3 justify-center">
          {sellers.map((seller) => (
            <button
              key={seller._id}
              type="button"
              onClick={() => handleTabClick(seller)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition focus:outline-none w-[48%] sm:w-auto md:min-w-48 md:min-h-16 ${
                selectedTab === seller._id
                  ? "bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white"
                  : "border-2 border-[var(--green-main)] text-[var(--green-main)] hover:bg-green-50"
              }`}
            >
              <div className="flex-shrink-0 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src={seller.company_logo}
                  alt="Supplier Logo"
                  width={48}
                  height={48}
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              <span className="text-xs md:text-sm font-medium truncate flex-1 text-center">
                {seller.company}
              </span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => router.push("/suppliers")}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-full border-2 border-[var(--green-main)] text-xs md:text-sm text-[var(--green-main)] hover:bg-green-50 transition focus:outline-none w-[48%] sm:w-auto md:min-w-36 md:min-h-16"
          >
            <span className="font-medium">See More</span>
            <Image
              src="/icons/lucide_arrow-up.svg"
              alt="Arrow Icon"
              width={16}
              height={16}
              className="flex-shrink-0"
            />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {products?.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="flex items-center justify-center">
          <button
            className="border border-[var(--green-light)] px-10 md:px-20 py-4 rounded-full text-[var(--green-light)] text-sm md:text-lg hover:bg-green-50 transition focus:outline-none flex items-center gap-2"
            onClick={() => router.push("/products")}
          >
            Explore All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsByBrand;

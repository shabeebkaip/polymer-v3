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

const ProductsByBrand: React.FC = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getSellers().then((response) => {
      const sellerData: Seller[] = response.data;
      setSellers(sellerData);
      if (sellerData.length > 0) {
        setSelectedTab(sellerData[0]._id);
        setProducts(sellerData[0].products || []);
      }
    });
  }, []);

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
        <div className="flex flex-wrap gap-4 justify-center">
          {sellers.map((seller) => (
            <button
              key={seller._id}
              type="button"
              onClick={() => handleTabClick(seller)}
              className={`flex items-center gap-4 px-2 py-1 rounded-full transition focus:outline-none ${
                selectedTab === seller._id
                  ? "bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white"
                  : "border-2 border-[var(--green-main)] text-[var(--green-main)] hover:bg-green-50"
              }`}
            >
              <div className="flex-shrink-0 rounded-full flex items-center justify-center">
                <Image
                  src={seller.company_logo}
                  alt="Supplier Logo"
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-lg">{seller.company}</span>
            </button>
          ))}
          <button
            type="button"
            className="flex items-center gap-4 px-4 py-2 rounded-full border-2 border-[var(--green-main)] text-xs md:text-lg text-[var(--green-main)] hover:bg-green-50 transition focus:outline-none"
          >
            See More{" "}
            <Image
              src="/icons/lucide_arrow-up.svg"
              alt="Arrow Icon"
              width={20}
              height={20}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="flex items-center justify-center">
          <button
            className="border border-[var(--green-light)] px-10 md:px-20 py-4 rounded-full text-[var(--green-light)] text-sm md:text-lg hover:bg-green-50 transition focus:outline-none flex items-center gap-2"
            onClick={() => router.push("/products")}
          >
            View All
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsByBrand;

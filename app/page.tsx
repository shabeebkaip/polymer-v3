import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import ProductsByBrand from "@/components/home/ProductsByBrand";
import {
  getIndustryList,
  getProductFamilies,
  getSellers,
} from "@/apiServices/shared";
import { get } from "http";

const Categories = dynamic(() => import("@/components/home/Categories"));

const BeneFits = dynamic(() => import("@/components/home/Benefits"));

export default async function HomePage() {
  const [industriesRes, familiesRes, sellersRes] = await Promise.all([
    getIndustryList(),
    getProductFamilies(),
    getSellers(),
  ]);

  const industries = industriesRes?.data || [];
  const productFamilies = familiesRes?.data || [];
  const sellers = sellersRes?.data || [];

  return (
    <div>
      <Hero />
      <Categories
        industries={industries}
        productFamiliesList={productFamilies}
      />
      <ProductsByBrand sellers={sellers} />
      <BeneFits />
    </div>
  );
}

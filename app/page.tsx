export const revalidate = 60; // Revalidate the whole page every 60 seconds

import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import ProductsByBrand from "@/components/home/ProductsByBrand";
import {
  getIndustryList,
  getProductFamilies,
  getSellers,
} from "@/apiServices/shared";
import { getBenefitsOfBuyers, getBenefitsOfSuppliers } from "@/apiServices/cms";

// Dynamic imports with SSR enabled
const Categories = dynamic(() => import("@/components/home/Categories"), {
  ssr: true,
});
const BeneFits = dynamic(() => import("@/components/home/Benefits"), {
  ssr: true,
});

export default async function HomePage() {
  const [
    industriesRes,
    familiesRes,
    sellersRes,
    buyersBenefitsRes,
    supplierBenefitsRes,
  ] = await Promise.all([
    getIndustryList(),
    getProductFamilies(),
    getSellers(),
    getBenefitsOfBuyers(),
    getBenefitsOfSuppliers(),
  ]);

  const industries = industriesRes?.data || [];
  const productFamilies = familiesRes?.data || [];
  const sellers = sellersRes?.data || [];
  const buyersBenefits = buyersBenefitsRes?.data || [];
  const suppliersBenefits = supplierBenefitsRes?.data || [];

  return (
    <div>
      <Hero />
      <Categories
        industries={industries}
        productFamiliesList={productFamilies}
      />
      <ProductsByBrand sellers={sellers} />
      <BeneFits
        buyersBenefits={buyersBenefits}
        suppliersBenefits={suppliersBenefits}
      />
    </div>
  );
}

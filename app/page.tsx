export const dynamic = "force-dynamic";

import nextDynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import ProductsByBrand from "@/components/home/ProductsByBrand";
import {
  getIndustryList,
  getProductFamilies,
  getSellers,
} from "@/apiServices/shared";
import { getBenefitsOfBuyers, getBenefitsOfSuppliers } from "@/apiServices/cms";

const Categories = nextDynamic(() => import("@/components/home/Categories"));
const BeneFits = nextDynamic(() => import("@/components/home/Benefits"));

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

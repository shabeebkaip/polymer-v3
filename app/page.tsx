"use client";
import Hero from "@/components/home/Hero";
import { useEffect } from "react";
import { useSharedState } from "@/stores/sharedStore";
import Categories from "@/components/home/Categories";
import ProductsByBrand from "@/components/home/ProductsByBrand";
import { useCmsStore } from "@/stores/cms";
import Benefits from "@/components/home/Benefits";

export default function HomePage() {
  const { fetchSellers, fetchIndustries, fetchProductFamilies } =
    useSharedState();
  const { getBenefitsOfBuyers, getBenefitsOfSuppliers } = useCmsStore();
  useEffect(() => {
    fetchSellers();
    fetchIndustries();
    fetchProductFamilies();
    getBenefitsOfBuyers();
    getBenefitsOfSuppliers();
  }, [fetchSellers]);
  return (
    <div>
      <Hero />
      <Categories />
      <ProductsByBrand />
      <Benefits />
    </div>
  );
}

// Revalidate the whole page every 60 seconds
"use client";
import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";

// Dynamic imports with SSR enabled
const BeneFits = dynamic(() => import("@/components/home/Benefits"));
const CategoryWrapper = dynamic(
  () => import("@/components/home/CategoryWrapper")
);
const ProductBySupplier = dynamic(
  () => import("@/components/home/ProductBySupplier")
);
const BenefitsWrapper = dynamic(
  () => import("@/components/home/BenefitsWrapper") // Disable SSR for this component
);

export default function HomePage() {
  return (
    <div>
      <Hero />
      <CategoryWrapper />
      <ProductBySupplier />
      <BenefitsWrapper />
    </div>
  );
}

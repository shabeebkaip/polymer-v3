
import Hero from "@/components/home/Hero";
import CategoryWrapper from "@/components/home/CategoryWrapper";
import ProductBySupplier from "@/components/home/ProductBySupplier";
import BenefitsWrapper from "@/components/home/BenefitsWrapper";

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

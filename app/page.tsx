import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import ProductsByBrand from "@/components/home/ProductsByBrand";
import QuoteRequestModal from "@/components/shared/QuoteRequestModal";

const Categories = dynamic(() => import("@/components/home/Categories"), {
  loading: () => <p>Loading categories...</p>,
});
const FeaturedSuppliers = dynamic(
  () => import("@/components/home/FeaturedSuppliers"),
  {
    loading: () => <p>Loading suppliers...</p>,
  }
);
const BeneFits = dynamic(() => import("@/components/home/Benefits"), {
  loading: () => <p>Loading benefits...</p>,
});

export default function Home() {
  return (
    <div className="">
      <Hero />
      <Categories />
      <ProductsByBrand />
      <BeneFits />
    </div>
  );
}

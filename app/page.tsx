import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";

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
      <FeaturedSuppliers />
      <BeneFits />
    </div>
  );
}

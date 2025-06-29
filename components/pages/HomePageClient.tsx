"use client";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import ProductsByBrand from "@/components/home/ProductsByBrand";
import Benefits from "@/components/home/Benefits";
import FeaturedSuppliers from "@/components/home/FeaturedSuppliers";
import HomeDataProvider from "@/components/providers/HomeDataProvider";
import DealsAndRequests from "@/components/home/DealsAndRequests";
import { HomePageData } from "@/types/home";

interface HomePageClientProps {
  initialData: HomePageData;
}

export default function HomePageClient({ initialData }: HomePageClientProps) {
  return (
    <HomeDataProvider initialData={initialData}>
      <div className="space-y-4 md:space-y-6 lg:space-y-8 bg-gradient-to-b from-white via-gray-50 to-white">
        <Hero />
        <DealsAndRequests />
        <Categories />
        <ProductsByBrand />
        <FeaturedSuppliers />
        <Benefits />
      </div>
    </HomeDataProvider>
  );
}

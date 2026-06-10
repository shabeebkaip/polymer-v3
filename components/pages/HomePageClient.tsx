"use client";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import ProductsByBrand from "@/components/home/ProductsByBrand";
import Benefits from "@/components/home/Benefits";
import HomeDataProvider from "@/components/providers/HomeDataProvider";
import DealsAndRequests from "@/components/home/DealsAndRequests";
import { HomePageClientProps } from "@/types/home";

export default function HomePageClient({ initialData }: HomePageClientProps) {
  return (
    <HomeDataProvider initialData={initialData}>
      <div className="bg-gradient-to-b from-white via-gray-50 to-white">
        <Hero />
        <DealsAndRequests />
        <Categories />
        <ProductsByBrand />
        <Benefits />
      </div>
    </HomeDataProvider>
  );
}

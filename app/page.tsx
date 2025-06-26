import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import ProductsByBrand from "@/components/home/ProductsByBrand";
import Benefits from "@/components/home/Benefits";
import FeaturedSuppliers from "@/components/home/FeaturedSuppliers";
import {
  getIndustryList,
  getProductFamilies,
  getSellers,
} from "@/apiServices/shared";
import { getBenefitsOfBuyers, getBenefitsOfSuppliers } from "@/apiServices/cms";
import { HomePageData } from "@/types/home";
import HomeDataProvider from "@/components/providers/HomeDataProvider";
import DealsAndRequests from "@/components/home/DealsAndRequests";

// Enable static generation with revalidation for better performance
export const revalidate = 300; // Revalidate every 5 minutes
export const dynamic = "force-static"; // Force static generation

// Server Component - Data fetched on server with caching
export default async function HomePage() {
  try {
    // Fetch all data in parallel on the server
    const [
      industriesRes,
      productFamiliesRes,
      sellersRes,
      buyersBenefitsRes,
      suppliersBenefitsRes,
    ] = await Promise.allSettled([
      getIndustryList(),
      getProductFamilies(),
      getSellers(),
      getBenefitsOfBuyers(),
      getBenefitsOfSuppliers(),
    ]);

    // Extract data with error handling
    const homeData: HomePageData = {
      industries:
        industriesRes.status === "fulfilled"
          ? industriesRes.value?.data || []
          : [],
      productFamilies:
        productFamiliesRes.status === "fulfilled"
          ? productFamiliesRes.value?.data || []
          : [],
      sellers:
        sellersRes.status === "fulfilled" ? sellersRes.value?.data || [] : [],
      buyersBenefits:
        buyersBenefitsRes.status === "fulfilled"
          ? buyersBenefitsRes.value?.data || {}
          : {},
      suppliersBenefits:
        suppliersBenefitsRes.status === "fulfilled"
          ? suppliersBenefitsRes.value?.data || {}
          : {},
    };

    return (
      <HomeDataProvider initialData={homeData}>
        <div>
          <Hero />
          <DealsAndRequests />
          <Categories />
          <ProductsByBrand />
          <FeaturedSuppliers />
          <Benefits />
        </div>
      </HomeDataProvider>
    );
  } catch (error) {
    console.error("Failed to fetch home page data:", error);

    // Return page with empty data in case of error
    const emptyData: HomePageData = {
      industries: [],
      productFamilies: [],
      sellers: [],
      buyersBenefits: {},
      suppliersBenefits: {},
    };

    return (
      <HomeDataProvider initialData={emptyData}>
        <div>
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
}

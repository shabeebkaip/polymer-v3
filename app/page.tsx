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
import { getBuyerOpportunities, getSuppliersSpecialDeals } from "@/apiServices/dealsAndRequests";
import { HomePageData } from "@/types/home";
import HomeDataProvider from "@/components/providers/HomeDataProvider";
import DealsAndRequests from "@/components/home/DealsAndRequests";

// Enable static generation with revalidation for better performance
// export const revalidate = 300; // Revalidate every 5 minutes
export const dynamic = "force-dynamic"; // Enable for debugging API calls

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
      buyerOpportunitiesRes,
      suppliersSpecialDealsRes,
    ] = await Promise.allSettled([
      getIndustryList(),
      getProductFamilies(),
      getSellers(),
      getBenefitsOfBuyers(),
      getBenefitsOfSuppliers(),
      getBuyerOpportunities(),
      getSuppliersSpecialDeals(),
    ]);

    console.log("API Results - buyerOpportunities:", buyerOpportunitiesRes.status);
    console.log("API Results - suppliersSpecialDeals:", suppliersSpecialDealsRes.status);

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
      buyerOpportunities:
        buyerOpportunitiesRes.status === "fulfilled"
          ? buyerOpportunitiesRes.value?.data || []
          : [],
      suppliersSpecialDeals:
        suppliersSpecialDealsRes.status === "fulfilled"
          ? suppliersSpecialDealsRes.value?.data || []
          : [],
    };
    
    console.log("homeData counts:");
    console.log("- buyerOpportunities:", homeData.buyerOpportunities?.length || 0);
    console.log("- suppliersSpecialDeals:", homeData.suppliersSpecialDeals?.length || 0);
    
    return (
      <HomeDataProvider initialData={homeData}>
        <div className="space-y-16  bg-gradient-to-b from-white via-gray-50 to-white">
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
      buyerOpportunities: [],
      suppliersSpecialDeals: [],
    };

    return (
      <HomeDataProvider initialData={emptyData}>
        <div className="space-y-16 md:space-y-24 bg-gradient-to-b from-white via-gray-50 to-white">
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

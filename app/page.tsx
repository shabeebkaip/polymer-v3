import {
  getIndustryList,
  getProductFamilies,
  getSellers,
} from "@/apiServices/shared";
import { getBenefitsOfBuyers, getBenefitsOfSuppliers } from "@/apiServices/cms";
import { getBuyerOpportunities, getSuppliersSpecialDeals } from "@/apiServices/dealsAndRequests";
import { HomePageData } from "@/types/home";
import HomePageClient from "@/components/pages/HomePageClient";

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
    
    return <HomePageClient initialData={homeData} />;
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

    return <HomePageClient initialData={emptyData} />;
  }
}

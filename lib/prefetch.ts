import { useSharedState } from "@/stores/sharedStore";
import { useCmsStore } from "@/stores/cms";

/**
 * Prefetch critical home page data
 * This can be called from layout or root to start fetching data early
 */
export const prefetchHomeData = async () => {
  try {
    const { fetchSellers, fetchIndustries, fetchProductFamilies } = useSharedState.getState();
    const { getBenefitsOfBuyers, getBenefitsOfSuppliers } = useCmsStore.getState();

    // Start all API calls in parallel for maximum performance
    await Promise.allSettled([
      fetchSellers(),
      fetchIndustries(),
      fetchProductFamilies(),
      getBenefitsOfBuyers(),
      getBenefitsOfSuppliers(),
    ]);
  } catch (error) {
    console.error('Failed to prefetch home data:', error);
  }
};

/**
 * Check if critical data is already loaded
 */
export const isCriticalDataLoaded = () => {
  const sharedState = useSharedState.getState();
  const cmsState = useCmsStore.getState();
  
  return (
    sharedState.sellers.length > 0 &&
    sharedState.industries.length > 0 &&
    sharedState.productFamilies.length > 0 &&
    (cmsState.buyersBenefits.content?.description?.length || 0) > 0 &&
    (cmsState.suppliersBenefits.content?.description?.length || 0) > 0
  );
};

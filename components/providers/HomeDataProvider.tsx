'use client';

import { HomeDataProviderProps } from '@/types/home';
import { useSharedState } from '@/stores/sharedStore';
import { useCmsStore } from '@/stores/cms';
import { useEffect, useState, useRef } from 'react';
import AnimatedPreloader from '@/components/shared/AnimatedPreloader';

/**
 * Provider that hydrates Zustand stores with server-side fetched data
 * This ensures both server and client have the same data (SSR hydration)
 * Also manages preloader state during hydration
 */
export default function HomeDataProvider({ children, initialData }: HomeDataProviderProps) {
  // Track hydration status
  const [isClient, setIsClient] = useState(false);
  const [, setIsHydrated] = useState(false);
  const hasInitialized = useRef(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    industries,
    productFamilies,
    sellers,
    buyerOpportunities,
    suppliersSpecialDeals,
    industriesLoading,
    familiesLoading,
    sellersLoading,
    buyerOpportunitiesLoading,
    suppliersSpecialDealsLoading,
    setIndustries,
    setProductFamilies,
    setSellers,
    setBuyerOpportunities,
    setSuppliersSpecialDeals,
  } = useSharedState();

  const { setBuyersBenefits, setSuppliersBenefits } = useCmsStore();

  // Hydrate stores only when we're on the client side and haven't initialized yet
  useEffect(() => {
    if (!isClient || hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;

    setIndustries(initialData.industries || []);
    setProductFamilies(initialData.productFamilies || []);
    setSellers(initialData.sellers || []);
    setBuyersBenefits(initialData.buyersBenefits || {});
    setSuppliersBenefits(initialData.suppliersBenefits || {});
    setBuyerOpportunities(initialData.buyerOpportunities || []);
    setSuppliersSpecialDeals(initialData.suppliersSpecialDeals || []);
    setIsHydrated(true);
  }, [
    isClient,
    initialData,
    setIndustries,
    setProductFamilies,
    setSellers,
    setBuyersBenefits,
    setSuppliersBenefits,
    setBuyerOpportunities,
    setSuppliersSpecialDeals,
  ]);


  // Only show preloader when actively fetching data (not for cached data)
  const isLoading =
    !isClient ||
    (industriesLoading && !industries?.length) ||
    (familiesLoading && !productFamilies?.length) ||
    (sellersLoading && !sellers?.length) ||
    (buyerOpportunitiesLoading && !buyerOpportunities?.length) ||
    (suppliersSpecialDealsLoading && !suppliersSpecialDeals?.length);

  return (
    <AnimatedPreloader isLoading={isLoading} message="Loading marketplace data...">
      {children}
    </AnimatedPreloader>
  );
}

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
  const [isHydrated, setIsHydrated] = useState(false);
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

  // Add debugging for the store state
  useEffect(() => {
    console.log('Current store state:', {
      buyerOpportunities: buyerOpportunities?.length || 0,
      suppliersSpecialDeals: suppliersSpecialDeals?.length || 0,
      isHydrated,
      isClient,
    });
  }, [buyerOpportunities, suppliersSpecialDeals, isHydrated, isClient]);

  // Hydrate stores only when we're on the client side and haven't initialized yet
  useEffect(() => {
    if (!isClient || hasInitialized.current) {
      return;
    }

    console.log('HomeDataProvider Effect - Running client-side hydration');
    console.log('HomeDataProvider Effect - initialData:', {
      buyerOpportunities: initialData.buyerOpportunities?.length || 0,
      suppliersSpecialDeals: initialData.suppliersSpecialDeals?.length || 0,
      industries: initialData.industries?.length || 0,
      productFamilies: initialData.productFamilies?.length || 0,
      sellers: initialData.sellers?.length || 0,
    });

    hasInitialized.current = true;

    // Force hydration of all data
    console.log('Setting industries:', initialData.industries?.length || 0);
    setIndustries(initialData.industries || []);

    console.log('Setting productFamilies:', initialData.productFamilies?.length || 0);
    setProductFamilies(initialData.productFamilies || []);

    console.log('Setting sellers:', initialData.sellers?.length || 0);
    setSellers(initialData.sellers || []);

    console.log('Setting CMS benefits');
    setBuyersBenefits(initialData.buyersBenefits || {});
    setSuppliersBenefits(initialData.suppliersBenefits || {});

    // Force set the deals data with detailed logging
    console.log(
      'Setting buyerOpportunities:',
      initialData.buyerOpportunities?.length || 0,
      'items'
    );
    console.log('BuyerOpportunities data preview:', initialData.buyerOpportunities?.slice(0, 1));
    setBuyerOpportunities(initialData.buyerOpportunities || []);

    console.log(
      'Setting suppliersSpecialDeals:',
      initialData.suppliersSpecialDeals?.length || 0,
      'items'
    );
    console.log(
      'SuppliersSpecialDeals data preview:',
      initialData.suppliersSpecialDeals?.slice(0, 1)
    );
    setSuppliersSpecialDeals(initialData.suppliersSpecialDeals || []);

    console.log('All data has been set, marking as hydrated');
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

  // Second effect to check if hydration worked
  useEffect(() => {
    if (isHydrated) {
      console.log('Hydration check - Store state after hydration:');
      console.log('- industries:', industries?.length);
      console.log('- productFamilies:', productFamilies?.length);
      console.log('- sellers:', sellers?.length);
      console.log('- buyerOpportunities:', buyerOpportunities?.length);
      console.log('- suppliersSpecialDeals:', suppliersSpecialDeals?.length);
    }
  }, [isHydrated, industries, productFamilies, sellers, buyerOpportunities, suppliersSpecialDeals]);

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

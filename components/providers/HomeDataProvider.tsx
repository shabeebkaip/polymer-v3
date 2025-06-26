"use client";

import { HomePageData } from "@/types/home";
import { useSharedState } from "@/stores/sharedStore";
import { useCmsStore } from "@/stores/cms";
import { useEffect, useState } from "react";
import AnimatedPreloader from "@/components/shared/AnimatedPreloader";

interface HomeDataProviderProps {
  children: React.ReactNode;
  initialData: HomePageData;
}

/**
 * Provider that hydrates Zustand stores with server-side fetched data
 * This ensures both server and client have the same data (SSR hydration)
 * Also manages preloader state during hydration
 */
export default function HomeDataProvider({ children, initialData }: HomeDataProviderProps) {
  const { 
    industries, 
    productFamilies, 
    sellers,
    setIndustries,
    setProductFamilies, 
    setSellers 
  } = useSharedState();
  
  const { 
    buyersBenefits, 
    suppliersBenefits,
    setBuyersBenefits,
    setSuppliersBenefits 
  } = useCmsStore();

  // Track hydration status
  const [isHydrating, setIsHydrating] = useState(true);
  const [hydrationSteps, setHydrationSteps] = useState({
    industries: false,
    productFamilies: false,
    sellers: false,
    buyersBenefits: false,
    suppliersBenefits: false,
  });

  // Check if all data is hydrated
  const isFullyHydrated = Object.values(hydrationSteps).every(Boolean);

  useEffect(() => {
    let hydrationComplete = true;
    const newSteps = { ...hydrationSteps };

    // Check and hydrate industries
    if (industries.length === 0 && initialData.industries.length > 0) {
      setIndustries(initialData.industries);
      hydrationComplete = false;
    } else if (industries.length > 0 || initialData.industries.length === 0) {
      newSteps.industries = true;
    }
    
    // Check and hydrate product families
    if (productFamilies.length === 0 && initialData.productFamilies.length > 0) {
      setProductFamilies(initialData.productFamilies);
      hydrationComplete = false;
    } else if (productFamilies.length > 0 || initialData.productFamilies.length === 0) {
      newSteps.productFamilies = true;
    }
    
    // Check and hydrate sellers
    if (sellers.length === 0 && initialData.sellers.length > 0) {
      setSellers(initialData.sellers);
      hydrationComplete = false;
    } else if (sellers.length > 0 || initialData.sellers.length === 0) {
      newSteps.sellers = true;
    }
    
    // Check and hydrate buyers benefits
    if (!buyersBenefits.content?.description && initialData.buyersBenefits.content?.description) {
      setBuyersBenefits(initialData.buyersBenefits);
      hydrationComplete = false;
    } else if (buyersBenefits.content?.description || !initialData.buyersBenefits.content?.description) {
      newSteps.buyersBenefits = true;
    }
    
    // Check and hydrate suppliers benefits
    if (!suppliersBenefits.content?.description && initialData.suppliersBenefits.content?.description) {
      setSuppliersBenefits(initialData.suppliersBenefits);
      hydrationComplete = false;
    } else if (suppliersBenefits.content?.description || !initialData.suppliersBenefits.content?.description) {
      newSteps.suppliersBenefits = true;
    }

    setHydrationSteps(newSteps);

    // If all steps are complete, mark hydration as done
    if (Object.values(newSteps).every(Boolean) && hydrationComplete) {
      setIsHydrating(false);
    }
  }, [
    initialData, 
    industries.length, 
    productFamilies.length, 
    sellers.length,
    buyersBenefits.content?.description,
    suppliersBenefits.content?.description,
    setIndustries,
    setProductFamilies,
    setSellers,
    setBuyersBenefits,
    setSuppliersBenefits,
    hydrationSteps
  ]);

  // Add a minimum loading time to prevent flashing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isFullyHydrated) {
        setIsHydrating(false);
      }
    }, 1000); // Minimum 1 second loading time

    return () => clearTimeout(timer);
  }, [isFullyHydrated]);

  return (
    <AnimatedPreloader isLoading={isHydrating}>
      {children}
    </AnimatedPreloader>
  );
}

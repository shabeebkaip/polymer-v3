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
  const [hasHydrated, setHasHydrated] = useState(false);

  // Hydrate stores with initial data once
  useEffect(() => {
    if (!hasHydrated) {
      // Hydrate all stores with initial data
      if (initialData.industries.length > 0) {
        setIndustries(initialData.industries);
      }
      if (initialData.productFamilies.length > 0) {
        setProductFamilies(initialData.productFamilies);
      }
      if (initialData.sellers.length > 0) {
        setSellers(initialData.sellers);
      }
      if (initialData.buyersBenefits.content?.description) {
        setBuyersBenefits(initialData.buyersBenefits);
      }
      if (initialData.suppliersBenefits.content?.description) {
        setSuppliersBenefits(initialData.suppliersBenefits);
      }
      
      setHasHydrated(true);
    }
  }, [
    initialData,
    hasHydrated,
    setIndustries,
    setProductFamilies,
    setSellers,
    setBuyersBenefits,
    setSuppliersBenefits
  ]);

  // Add a minimum loading time and wait for hydration
  useEffect(() => {
    if (hasHydrated) {
      const timer = setTimeout(() => {
        setIsHydrating(false);
      }, 1000); // Minimum 1 second loading time

      return () => clearTimeout(timer);
    }
  }, [hasHydrated]);

  return (
    <AnimatedPreloader isLoading={isHydrating}>
      {children}
    </AnimatedPreloader>
  );
}

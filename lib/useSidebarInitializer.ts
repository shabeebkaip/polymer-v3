"use client";

import { useEffect, useRef } from "react";
import { useUserInfo } from "@/lib/useUserInfo";
import { useSharedState } from "@/stores/sharedStore";
import Cookies from "js-cookie";

export const useSidebarInitializer = () => {
  const { user, isInitialized } = useUserInfo();
  const { sidebarItems, sidebarLoading, fetchSidebarItems } = useSharedState();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const token = Cookies.get("token");
    
    console.log("useSidebarInitializer: Checking conditions", {
      hasToken: !!token,
      isInitialized,
      hasUser: !!user,
      sidebarItemsCount: sidebarItems.length,
      sidebarLoading,
      hasFetched: hasFetchedRef.current
    });

    // Fetch if we have a token and haven't fetched yet
    if (token && !sidebarLoading && sidebarItems.length === 0 && !hasFetchedRef.current) {
      console.log("useSidebarInitializer: Conditions met, fetching sidebar");
      hasFetchedRef.current = true;
      fetchSidebarItems();
    }
  }, [user, isInitialized, sidebarItems.length, sidebarLoading, fetchSidebarItems]);

  return { sidebarItems, sidebarLoading };
};

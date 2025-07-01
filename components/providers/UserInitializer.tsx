"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/lib/useUserInfo";
import { useSharedState } from "@/stores/sharedStore";
import Cookies from "js-cookie";

const UserInitializer = () => {
  const router = useRouter();
  const { user, isInitialized, loadUserFromCookies } = useUserInfo();
  const { sidebarItems, sidebarLoading, fetchSidebarItems } = useSharedState();
  const mountedRef = useRef(false);

  // Initialize user on mount
  useEffect(() => {
    const token = Cookies.get("token");
    
    console.log("UserInitializer: Starting initialization", {
      hasToken: !!token,
      isInitialized,
      hasUser: !!user,
      hasUserInfo: !!Cookies.get("userInfo"),
      sidebarItemsCount: sidebarItems.length,
      sidebarLoading,
      mounted: mountedRef.current
    });

    // Redirect to home if no token
    if (!token) {
      console.log("UserInitializer: No token found, redirecting to home");
      router.push("/");
      return;
    }

    if (!mountedRef.current) {
      mountedRef.current = true;
      
      // Load user from cookies if not initialized
      if (!isInitialized) {
        console.log("UserInitializer: Loading user from cookies");
        loadUserFromCookies();
      }

      // If we have a token but no sidebar data, fetch it
      if (sidebarItems.length === 0 && !sidebarLoading) {
        console.log("UserInitializer: Token found, fetching sidebar immediately");
        fetchSidebarItems();
      }
    }
  }, []); // Empty dependency array for mount-only effect

  // Fetch sidebar data when user becomes available
  useEffect(() => {
    const token = Cookies.get("token");
    if (isInitialized && token && sidebarItems.length === 0 && !sidebarLoading) {
      console.log("UserInitializer: User initialized, fetching sidebar");
      fetchSidebarItems();
    }
  }, [isInitialized, fetchSidebarItems, sidebarItems.length, sidebarLoading]);

  // This component doesn't render anything, it just initializes user data
  return null;
};

export default UserInitializer;

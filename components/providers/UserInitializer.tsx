"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/lib/useUserInfo";
import Cookies from "js-cookie";

const UserInitializer = () => {
  const router = useRouter();
  const { user, isInitialized, loadUserFromCookies } = useUserInfo();
  const mountedRef = useRef(false);

  // Initialize user on mount
  useEffect(() => {
    const token = Cookies.get("token");
    
    console.log("UserInitializer: Starting initialization", {
      hasToken: !!token,
      isInitialized,
      hasUser: !!user,
      hasUserInfo: !!Cookies.get("userInfo"),
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
    }
  }, []); // Empty dependency array for mount-only effect

  // This component doesn't render anything, it just initializes user data
  return null;
};

export default UserInitializer;

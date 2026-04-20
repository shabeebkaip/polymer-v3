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
    
    if (!token) {
      router.push("/");
      return;
    }

    if (!mountedRef.current) {
      mountedRef.current = true;
      if (!isInitialized) {
        loadUserFromCookies();
      }
    }
  }, [isInitialized, loadUserFromCookies, router, user]); // Add all dependencies

  // This component doesn't render anything, it just initializes user data
  return null;
};

export default UserInitializer;

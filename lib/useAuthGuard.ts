"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const useAuthGuard = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get("token");
      const userInfo = Cookies.get("userInfo");
      
      if (!token || !userInfo) {
        console.log("Auth guard: No valid authentication found, redirecting to home");
        // Clear any remaining cookies
        Cookies.remove("token");
        Cookies.remove("userInfo");
        router.push("/");
        return false;
      }
      
      return true;
    };

    // Check immediately
    checkAuth();

    // Set up interval to check periodically (every 5 minutes)
    const interval = setInterval(() => {
      checkAuth();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [router]);
};

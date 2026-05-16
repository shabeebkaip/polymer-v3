"use client";

import { useEffect } from "react";
import { useUserInfo } from "@/lib/useUserInfo";

/**
 * Loads user state from cookies AFTER hydration.
 * Must run in useEffect so server and initial client render both
 * produce user=null — preventing a hydration mismatch crash.
 * Does NOT redirect — public pages are always accessible.
 */
const UserInitializer = () => {
  const { isInitialized, loadUserFromCookies } = useUserInfo();

  useEffect(() => {
    if (!isInitialized) {
      loadUserFromCookies();
    }
    // Intentionally empty dep array: run once after first mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default UserInitializer;

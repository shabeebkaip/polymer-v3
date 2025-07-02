"use client";

// This hook is deprecated - sidebar now uses fallback data only
// Keeping this file for backward compatibility but it does nothing
export const useSidebarInitializer = () => {
  console.log("useSidebarInitializer: Using fallback sidebar data only");
  return { sidebarItems: [], sidebarLoading: false };
};

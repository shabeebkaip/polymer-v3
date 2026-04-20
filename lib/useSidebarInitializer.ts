"use client";

// This hook is deprecated - sidebar now uses fallback data only
// Keeping this file for backward compatibility but it does nothing
export const useSidebarInitializer = () => {
  return { sidebarItems: [], sidebarLoading: false };
};

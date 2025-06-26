"use client";

import { useEffect, useState } from "react";

/**
 * Global App Preloader - Shows during initial app load
 * This component handles the transition from server-side rendered content to client hydration
 */
export default function GlobalPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Hide preloader after a short delay to ensure smooth hydration
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setIsLoading(false), 300);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[60] bg-gradient-to-br from-green-50 to-white flex items-center justify-center transition-opacity duration-300 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Minimalist logo animation */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <div className="text-white font-bold text-xl">P</div>
          </div>
          <div className="absolute inset-0 w-16 h-16 border-2 border-green-300 border-t-green-500 rounded-xl animate-spin"></div>
        </div>

        {/* Simple loading text */}
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

interface AnimatedPreloaderProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  minimal?: boolean;
}

export default function AnimatedPreloader({ 
  isLoading, 
  children, 
  message = "Loading...",
  minimal = false 
}: AnimatedPreloaderProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setFadeOut(true);
    } else {
      setFadeOut(false);
    }
  }, [isLoading]);

  // Don't show preloader at all if not loading (let Zustand handle state)
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Professional Loading Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        {minimal ? (
          /* Minimal loader for small components */
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
            <span className="text-gray-600 font-medium">{message}</span>
          </div>
        ) : (
          /* Full professional loader */
          <div className="flex flex-col items-center space-y-6 px-4">
            {/* Professional logo/spinner */}
            <div className="relative">
              {/* Main spinner */}
              <div className="w-16 h-16 border-4 border-gray-100 border-t-green-600 border-r-green-600 rounded-full animate-spin"></div>
              
              {/* Inner dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Professional text */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {message}
              </h3>
              <p className="text-sm text-gray-500">
                Please wait a moment
              </p>
            </div>

            {/* Professional loading bar */}
            <div className="w-64 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-pulse"
                style={{
                  transformOrigin: 'left center',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className={`transition-opacity duration-300 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
        {children}
      </div>
    </>
  );
}

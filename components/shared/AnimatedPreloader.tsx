"use client";

import { useEffect, useState } from "react";

interface AnimatedPreloaderProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export default function AnimatedPreloader({ isLoading, children }: AnimatedPreloaderProps) {
  const [showPreloader, setShowPreloader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressTimer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    if (!isLoading) {
      // Complete the progress bar
      setLoadingProgress(100);
      
      // Start fade out animation after a brief delay
      setTimeout(() => {
        setFadeOut(true);
        
        // Hide preloader after fade out completes
        setTimeout(() => {
          setShowPreloader(false);
        }, 600); // Match with CSS transition duration
      }, 300);

      clearInterval(progressTimer);
    }

    return () => clearInterval(progressTimer);
  }, [isLoading]);

  if (!showPreloader) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Preloader Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-gradient-to-br from-white via-green-50/30 to-white flex items-center justify-center transition-all duration-600 ${
          fadeOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="flex flex-col items-center space-y-8 px-4">
          {/* Animated Logo/Brand with enhanced effects */}
          <div className="relative">
            {/* Main logo container with enhanced animations */}
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
              <div className="text-white font-bold text-3xl animate-bounce">P</div>
            </div>
            
            {/* Multiple rotating rings for visual appeal */}
            <div className="absolute inset-0 w-24 h-24 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 w-20 h-20 border-2 border-green-100 border-b-green-400 rounded-full animate-spin animate-reverse" style={{ animationDuration: '3s' }}></div>
            
            {/* Pulsing outer glow */}
            <div className="absolute inset-0 w-24 h-24 bg-green-400/20 rounded-full animate-ping"></div>
          </div>

          {/* Brand name with staggered animation */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-3 tracking-wide">
              {['P', 'o', 'l', 'y', 'm', 'e', 'r'].map((letter, index) => (
                <span 
                  key={index}
                  className="inline-block animate-bounce text-green-700"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animationDuration: '1s'
                  }}
                >
                  {letter}
                </span>
              ))}
            </h1>
            <p className="text-gray-600 text-base animate-pulse">
              Preparing your marketplace experience...
            </p>
          </div>

          {/* Enhanced loading dots */}
          <div className="flex space-x-3">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-bounce shadow-lg"
                style={{ 
                  animationDelay: `${index * 0.15}s`,
                  animationDuration: '0.8s'
                }}
              ></div>
            ))}
          </div>

          {/* Animated progress bar */}
          <div className="w-80 max-w-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Loading</span>
              <span className="text-sm text-green-600 font-semibold">
                {Math.round(loadingProgress)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${loadingProgress}%` }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Loading messages that change */}
          <div className="text-center min-h-[1.5rem]">
            <p className="text-sm text-gray-500 animate-pulse">
              {loadingProgress < 30 && "Fetching product data..."}
              {loadingProgress >= 30 && loadingProgress < 60 && "Loading categories and suppliers..."}
              {loadingProgress >= 60 && loadingProgress < 90 && "Preparing your experience..."}
              {loadingProgress >= 90 && "Almost ready!"}
            </p>
          </div>
        </div>
      </div>

      {/* Main content (hidden behind preloader) */}
      <div className={`transition-opacity duration-600 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        {children}
      </div>
    </>
  );
}

"use client";

import React, { Suspense } from "react";
import Register from "@/components/auth/register/Register";

// Loading component for Suspense boundary
function RegisterLoading() {
  return (
    <div className="min-h-screen bg-[url('/assets/authbg.png')] bg-cover bg-center flex items-center justify-center px-4 py-4 relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-transparent to-emerald-900/20"></div>
      
      {/* Loading content */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-5xl border border-white/20">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          
          {/* Form skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          
          {/* Button skeleton */}
          <div className="h-12 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <Register />
    </Suspense>
  );
}
